var express = require('express');
var router = express.Router();
var models  = require('../models');
var AttendanceService = require('../services/attendance');

const attendanceService = new AttendanceService();

/* Path: /legislature/LXIII/attendance => attendance.js
  /api/legislature/LXIII/attendance/avg
  /api/legislature/LXIII/attendance/frequency
  /api/legislature/LXIII/attendance/by_party
  /api/legislature/LXIII/attendance/by_deputy_type
*/

/* /api/legislature/LXIII/attendance */
router.get('/', function(req, res, next) {
    attendanceService.getAttendanceList().then((result) => {
      res.json(result);
    });
  });

/* /api/legislature/LXIII/attendance/avg */
router.get('/avg', function(req, res, next) {
  attendanceService.getAttendanceAvg().then((result) => {
    res.json(result);
  });
});

/* /api/legislature/LXIII/attendance/frequency */
router.get('/frequency', function(req, res, next) {
  attendanceService.getAttendanceFrequency().then((result) => {
    res.json(result);
  });
});

/* /api/legislature/LXIII/attendance/by_party */
router.get('/by_party', function(req, res, next) {
  attendanceService.getAttendanceByParty().then((result) => {
    res.json(result);
  });
});

/* /api/legislature/LXIII/attendance/by_state */
router.get('/by_state', function(req, res, next) {
  attendanceService.getAttendanceByState().then((result) => {
    res.json(result);
  });
});

/* /api/legislature/LXIII/attendance/by_deputy_type */
router.get('/by_deputy_type', function(req, res, next) {
  attendanceService.getAttendanceByType().then((result) => {
    res.json(result);
  });
});

module.exports = router;
