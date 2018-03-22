var express = require('express');
var router = express.Router();
var models  = require('../models');
var DeputyService = require('../services/deputy');

const deputyService = new DeputyService();

/* Path: /camara-de-diputados/LXIII/deputy => deputy.js
 /api/camara-de-diputados/LXIII/deputy/<seatId>/attendance
 /api/camara-de-diputados/LXIII/deputy/<seatId>/initiatives
*/

/* /api/camara-de-diputados/LXIII/deputy/<seatId>/attendance */
router.get('/:id/attendance', function(req, res, next) {
  deputyService.getAttendanceDetails(req.params.id).then((result) => {
    res.json(result);
  });
});

module.exports = router;

/* Path: /camara-de-diputados/LXIII/initiatives => initiatives.js
  /api/camara-de-diputados/LXIII/initiatives/avg
  /api/camara-de-diputados/LXIII/initiatives/frequency
  /api/camara-de-diputados/LXIII/initiatives/by_party
  /api/camara-de-diputados/LXIII/initiatives/by_deputy_type
*/
