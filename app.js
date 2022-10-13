var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors'); 

// importing routes
var epsRouter = require('./routes/eps');
var peRatioRouter = require('./routes/peRatio');

var app = express();

const IP = process.env.IP || '0.0.0.0';
const PORT = process.env.PORT || 3000;
app.listen(PORT, IP);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.options('*', cors());

// all routes
app.use('/eps', epsRouter);
app.use('/pe', peRatioRouter);

// home page with no query strings
app.get('/', (req, res) => {
  res.send("Enter /eps or /pe followed by ?ticker=${ticker}");
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
