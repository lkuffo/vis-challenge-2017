var express = require('express');
var path = require('path');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var cors = require('cors');
var multipart = require('connect-multiparty')
var bodyParser = require('body-parser');

var User = require('./models/User');


// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(
  function(username, password, done) {
    User.findOne({ 'correo': username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      //if (user.password != password) {
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user._id);
});

passport.deserializeUser(function(id, cb) {
	User.findOne({ '_id': id }, function(err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// New Express app

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(multipart());
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

var bcrypt = require('bcrypt');

// Bcrypt variables
const saltRounds = 10;
const myPlaintextPassword = 'Fund@m3n70S';
const someOtherPlaintextPassword = 'py7h0N';

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


// CSS's Y JS's
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/css', express.static(__dirname + '/node_modules/datatables/media/css')); // redirect CSS datatables
app.use('/js', express.static(__dirname + '/node_modules/datatables/media/js')); // redirect JS datatables
app.use('/uploads', express.static(__dirname + '/uploads')); // redirect JS datatables
app.use('/material', express.static(__dirname + '/node_modules/bootstrap-material-design/dist')); // redirect JS datatables
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/index'));
app.use('/users', require('./routes/index'));
app.use('/api/publicidad', require('./routes/publicidad'));
app.use('/api/users', require('./routes/user'));
app.use('/imagen', require('./routes/imagen'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  next();
});

module.exports = app;
