// dependencies
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var hash = require('bcrypt-nodejs');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var path = require('path');
var passport = require('passport');

var localStrategy = require('passport-local' ).Strategy;
var app = express();
var User = require('./models/user.js');

//db connection
mongoose.connect('mongodb://localhost/cards', function(err, db){
  if(!err) {
    console.log('mongoose is connected');
  } else {
    console.log(err);
  }
});

// middleware
app.use(express.static(path.join(__dirname, '../client')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'shanky',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// app.use(methodOverride());

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
