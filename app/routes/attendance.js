var express = require('express');
var router = express.Router();
var models  = require('../models');
var cache = require('../config/cache');

/* Path: /legislature/LXIII/attendance => attendance.js
  /api/legislature/LXIII/attendance/avg
  /api/legislature/LXIII/attendance/frequency
  /api/legislature/LXIII/attendance/by_party
  /api/legislature/LXIII/attendance/by_deputy_type
*/

/* /api/legislature/LXIII/attendance */
router.get('/', cache.cacheFilter('LXIII-attendance'), function(req, res, next) {
    let queryString =
      'select * from attendance_list order by entries desc';

    models.sequelize
    .query(queryString, {
      type: models.sequelize.QueryTypes.SELECT
    })
    .then(function(result) {
      cache.cache('LXIII-attendance', result);
      res.json(result);
    });
  });

/* /api/legislature/LXIII/attendance/avg */
router.get('/avg', cache.cacheFilter('LXIII-attendance-avg'), function(req, res, next) {
  let queryString =
    'select avg(quantity) as average, max(quantity) as max, min(quantity) as min from seat_attendance';

  models.sequelize
  .query(queryString, {
    type: models.sequelize.QueryTypes.SELECT
  })
  .then(function(result) {
    cache.cache('LXIII-attendance-avg', result[0]);
    res.json(result[0]);
  });
});

/* /api/legislature/LXIII/attendance/frequency */
router.get('/frequency', cache.cacheFilter('LXIII-attendance-frequency'), function(req, res, next) {
  let queryString =
    'select st2.quantity, st2.frequency, @running_total := @running_total + st2.frequency AS cumulative_frequency from attendance_frequency st2 join (select @running_total := 0) r'

  models.sequelize
  .query(queryString, {
    type: models.sequelize.QueryTypes.SELECT
  })
  .then(function(result) {
    cache.cache('LXIII-attendance-frequency', result);
    res.json(result);
  });
});

/* /api/legislature/LXIII/attendance/by_party */
router.get('/by_party', cache.cacheFilter('LXIII-attendance-by-party'), function(req, res, next) {
  let queryString =
    'select party, round(avg(quantity), 2) as average, max(quantity) as max, min(quantity) as min, round(avg(quantity) + stddev(quantity)/2, 2) as max_std, round(avg(quantity) - stddev(quantity)/2,2) as min_std, count(1) as deputies from seat_attendance group by party order by average';

  models.sequelize
  .query(queryString, {
    type: models.sequelize.QueryTypes.SELECT
  })
  .then(function(result) {
    cache.cache('LXIII-attendance-by-party', result);
    res.json(result);
  });
});

/* /api/legislature/LXIII/attendance/by_state */
router.get('/by_state', cache.cacheFilter('LXIII-attendance-by-state'), function(req, res, next) {
  let queryString =
    'select state, round(avg(entries), 2) as average, max(entries) as max, min(entries) as min, round(avg(entries) + stddev(entries)/2, 2) as max_std, round(avg(entries) - stddev(entries)/2,2) as min_std, count(1) as deputies from attendance_list group by state order by average';

  models.sequelize
  .query(queryString, {
    type: models.sequelize.QueryTypes.SELECT
  })
  .then(function(result) {
    cache.cache('LXIII-attendance-by-state', result);
    res.json(result);
  });
});

/* /api/legislature/LXIII/attendance/by_deputy_type */
router.get('/by_deputy_type', cache.cacheFilter('LXIII-attendance-by-deputy-type'), function(req, res, next) {
  let queryString =
    'select type, party, avg(quantity) as average, count(1) as deputies from seat_attendance group by type, party order by party, type';

  models.sequelize
  .query(queryString, {
    type: models.sequelize.QueryTypes.SELECT
  })
  .then(function(result) {
    cache.cache('LXIII-attendance-by-deputy-type', result);
    res.json(result);
  });
});

module.exports = router;
