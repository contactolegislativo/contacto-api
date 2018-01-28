var express = require('express');
var router = express.Router();
var models  = require('../models');

/* Path: /legislature/LXIII/attendance => attendance.js
  /api/legislature/LXIII/attendance/avg
  /api/legislature/LXIII/attendance/frequency
  /api/legislature/LXIII/attendance/by_party
  /api/legislature/LXIII/attendance/by_deputy_type
*/

/* /api/legislature/LXIII/attendance/avg */
router.get('/avg', function(req, res, next) {
  let queryString =
    'select avg(quantity) as average, max(quantity) as max from seat_attendance';

  models.sequelize
  .query(queryString, {
    type: models.sequelize.QueryTypes.SELECT
  })
  .then(function(result) {
    res.json(result);
  });
});

/* /api/legislature/LXIII/attendance/frequency */
router.get('/frequency', function(req, res, next) {
  let queryString =
    'select st2.quantity, st2.frequency, @running_total := @running_total + st2.frequency AS cumulative_frequency from attendance_frequency st2 join (select @running_total := 0) r'

  models.sequelize
  .query(queryString, {
    type: models.sequelize.QueryTypes.SELECT
  })
  .then(function(result) {
    res.json(result);
  });
});

/* /api/legislature/LXIII/attendance/by_party */
router.get('/by_party', function(req, res, next) {
  let queryString =
    'select party, avg(quantity) as average, count(1) as deputies from seat_attendance group by party order by average';

  models.sequelize
  .query(queryString, {
    type: models.sequelize.QueryTypes.SELECT
  })
  .then(function(result) {
    res.json(result);
  });
});

/* /api/legislature/LXIII/attendance/by_deputy_type */
router.get('/by_deputy_type', function(req, res, next) {
  let queryString =
    'select type, party, avg(quantity) as average, count(1) as deputies from seat_attendance group by type, party order by party, type';

  models.sequelize
  .query(queryString, {
    type: models.sequelize.QueryTypes.SELECT
  })
  .then(function(result) {
    res.json(result);
  });
});

module.exports = router;
