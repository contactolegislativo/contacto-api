var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sessionInitalizer = require('./config/session');
var env       = process.env.NODE_ENV || 'development';

var deputy = require('./routes/deputy');
var attendance = require('./routes/attendance');

var app = express();

// Initialize session management
sessionInitalizer(app);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/legislature/LXIII/deputy', deputy);
app.use('/legislature/LXIII/attendance', attendance);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err.message)
    res.render('error', {
      title: `Error ${err.status}`,
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(err);
  res.render('error', {
    title: `Error ${err.status}`,
    message: err.message,
    error: {}
  });
});

module.exports = app;
