var express = require('express');
var router = express.Router();
var models  = require('../models');

// select st2.attendance, st2.quantity, st2.frequency, @running_total := @running_total + st2.frequency AS cumulative_frequency
// from (
//   select st.attendance, st.quantity, count(1) as frequency from (
//     select s.id, a.attendance, count(1) as quantity
//     from Seats s join Deputies d on s.id = d.SeatId join Attendances a on a.DeputyId = d.id
//     where a.attendance in ('A', 'AO', 'PM', 'IV')
//     group by s.id, a.attendance
//     order by s.id
//   ) st
//   group by st.attendance, st.quantity
// ) st2 join (select @running_total := 0) r ;

// select st2.quantity, st2.frequency, @running_total := @running_total + st2.frequency AS cumulative_frequency
// from (
//   select st.quantity, count(1) as frequency from (
//     select s.id, count(1) as quantity
//     from Seats s join Deputies d on s.id = d.SeatId join Attendances a on a.DeputyId = d.id
//     where a.attendance in ('A', 'AO', 'PM', 'IV')
//     group by s.id
//   ) st
//   group by st.quantity
// ) st2 join (select @running_total := 0) r ;

/* /api/<deputy>/attendance */
router.get('/', function(req, res, next) {
  let queryString =
    //'select s.id, s.type, d.party, a.attendance, count(1) as quantity from Seats s join Deputies d on s.id = d.SeatId join Attendances a on a.DeputyId = d.id group by s.id, s.type, d.party, a.attendance';
    'select st2.quantity, st2.frequency, @running_total := @running_total + st2.frequency AS cumulative_frequency ' +
    'from ( ' +
    '  select st.quantity, count(1) as frequency from ( ' +
    '    select s.id, count(1) as quantity ' +
    '    from Seats s join Deputies d on s.id = d.SeatId join Attendances a on a.DeputyId = d.id ' +
    '    where a.attendance in (\'A\', \'AO\', \'PM\', \'IV\') ' +
    '    group by s.id ' +
    '  ) st ' +
    '  group by st.quantity ' +
    ') st2 join (select @running_total := 0) r ';

  models.sequelize
  .query(queryString, {
    type: models.sequelize.QueryTypes.SELECT
  })
  .then(function(deputies) {
    // let response = [];
    // deputies.forEach(deputies => {
    //   response.push({})
    // });
    res.json(deputies);
  });
});

/* /api/<deputy>/attendance */
router.get('/:id', function(req, res, next) {
  let queryString =
    'select a.attendance as name, count(1) as value from Attendances a left outer join Deputies de on de.id = a.DeputyId left outer join Seats s on s.id = de.SeatId where s.id = :districtId group by a.attendance';

  models.sequelize
  .query(queryString, {
    replacements: { districtId: req.params.id },
    type: models.sequelize.QueryTypes.SELECT
  })
  .then(function(attendance) {
    res.json(attendance);
  });
});

module.exports = router;
