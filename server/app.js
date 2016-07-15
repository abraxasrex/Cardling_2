// dependencies
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var mongoose = require('mongoose');
var path = require('path');
var passport = require('passport');
var localStrategy = require('passport-local' ).Strategy;
var app = express();
var User = require('./models/user.js');

// db connection
mongoose.connect('mongodb://localhost/cards', function(err){
  if(!err) {
    console.log('mongoose is connected');
  } else {
    console.log(err);
  }
});
//mongoose.connect('mongodb://heroku_x5cb07d7:ahnbodvajj0op1dt53fd2j9g59@ds043002.mlab.com:43002/heroku_x5cb07d7');

// middleware
app.use(express.static(path.join(__dirname, '../client')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookieSession({
  name: 'test_session',
  keys: ['key1', 'key2']
}));
app.use(passport.initialize());
app.use(passport.session());

// configure passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// routing
var view_routes = require('./routes/view-routes.js');
require('./routes/card-routes.js')(app);
app.use('/user/', view_routes);
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

// error handling
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.end(JSON.stringify({
    message: err.message,
    error: {}
  }));
});

module.exports = app;
