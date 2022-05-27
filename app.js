//#region IMPORTS
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
//#endregion IMPORTS

//#region ROUTE IMPORTS
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var roleRouter = require('./routes/role');
//#endregion ROUTE IMPORTS

//#region MONGODB CONNECTION
var db = require('./db');
db.connectToDB()
db.getConnection().asPromise().then(() => {
  console.log("Conexión Exitosa a Cluster Mongo Atlas")
}).catch((err) => console.error(err));
//#endregion MONGODB CONNECTION

var app = express();

app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//#region ROUTE USAGE
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/role', roleRouter);
//#region ROUTE USAGE

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;