var express = require('express');
var router = express.Router();
var models  = require('../models');

/* Path: /legislature/LXIII/deputy => deputy.js
 /api/legislature/LXIII/deputy/<seatId>/attendance
 /api/legislature/LXIII/deputy/<seatId>/initiatives
*/

/* /api/legislature/LXIII/deputy/<seatId>/attendance */
router.get('/:id/attendance', function(req, res, next) {
  let queryString =
    'select a.attendance as name, a.description, count(1) as value from Attendances a left outer join Deputies de on de.id = a.DeputyId left outer join Seats s on s.id = de.SeatId where s.id = :districtId group by a.attendance, a.description';

  models.sequelize
  .query(queryString, {
    replacements: { districtId: req.params.id },
    type: models.sequelize.QueryTypes.SELECT
  })
  .then(function(attendance) {
    // Calculate positive attendance days
    let total = attendance.reduce((acc, item) => {
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

    res.json({
      details: attendance,
      total: total
    });
  });
});

module.exports = router;

/* Path: /legislature/LXIII/initiatives => initiatives.js
  /api/legislature/LXIII/initiatives/avg
  /api/legislature/LXIII/initiatives/frequency
  /api/legislature/LXIII/initiatives/by_party
  /api/legislature/LXIII/initiatives/by_deputy_type
*/
