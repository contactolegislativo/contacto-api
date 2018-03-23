const models  = require('../models');
const CacheManager = require('./cache-manager');

const attendance_list = 'select * from ActiveDeputies order by id';
const attendance_avg = 'select * from attendance_overview';
const attendance_frequency = 'select * from attendance_frequency';
const attendance_by_party = 'select * from attendance_by_party';
const attendance_by_state = 'select * from attendance_by_state';
const attendance_by_type = 'select * from attendance_by_deputy_type';

const cacheManager = new CacheManager();

class AttendanceService {
  resolveQuery(query, replacements) {
    return models.sequelize
      .query(query, {
        replacements: replacements,
        type: models.sequelize.QueryTypes.SELECT
      });
  }

  resolve(query) {
    const _self = this;
    return new Promise(function(resolve, reject) {
      cacheManager.find(query)
        .then(response => {
          if(response.found) {
            resolve(response.data);
          } else {
            _self.resolveQuery(query)
              .then(result => {
                cacheManager.store(query, result);
                resolve(result);
              })
              .catch(err => {
                reject(err);
              });
          }
        });
    });

  }

  getAttendanceList() {
    return this.resolve(attendance_list);
  }

  getAttendanceAvg() {
    return this.resolve(attendance_avg);
  }

  getAttendanceFrequency() {
    return this.resolve(attendance_frequency);
  }

  getAttendanceByParty() {
    return this.resolve(attendance_by_party);
  }

  getAttendanceByState() {
    return this.resolve(attendance_by_state);
  }

  getAttendanceByType() {
    return this.resolve(attendance_by_type);
  }


}

module.exports = AttendanceService;
