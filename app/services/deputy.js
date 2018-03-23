const models  = require('../models');
const CacheManager = require('./cache-manager');

const attendance_details_query =
  `select a.attendance as name, a.description, count(1) as value
    from Seats s join Attendances a on s.id = a.SeatId
    where s.id = :seatId group by a.attendance, a.description`;

const cacheManager = new CacheManager();

class DeputyService {
  resolveQuery(query, replacements) {
    return models.sequelize
      .query(query, {
        replacements: replacements,
        type: models.sequelize.QueryTypes.SELECT
      });
  }

  resolve(label, query, replacements) {
    const _self = this;

    return new Promise(function(resolve, reject) {
      cacheManager.find(label)
        .then(response => {
          if(response.found) {
            resolve(response.data);
          } else {
            _self.resolveQuery(query, replacements)
              .then(result => {
                cacheManager.store(label, result);
                resolve(result);
              })
              .catch(err => {
                reject(err);
              });
          }
        });
    });
  }

  getAttendanceDetails(seatId) {
    const _self = this;
    return new Promise((resolve, reject) => {
      _self.resolve(`s${seatId}_details`, attendance_details_query, { seatId })
        .then(details =>{
          // Calculate positive details days
          let total = details.reduce((acc, item) => {
            switch(item.name) {
              case 'A':
              case 'AO':
              case 'PM':
              case 'IV':
                return acc + item.value;
              default:
                return acc;
            }
          }, 0);

          resolve({ details, total });
        })
        .catch(err => {
          reject(err);
        });
    });

  }
}

module.exports = DeputyService;
