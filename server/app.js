const config = require('./config/default');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mysql = require('mysql');
const session = require('express-session');
const MySQLstore = require('express-mysql-session')(session);
// const routes = require('./routes')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const diskRouter = require('./routes/disk')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//session设置
let options = {
  host:config.dbHost,
  port:config.dbPort,
  user:config.username,
  password:config.password,
  database:config.database
  // clearExpired: true,
  // checkExpirationInterval: 900000,
  // expiration: 86400000,
}
// let connection = mysql.createConnection(options);
let sessionStore = new MySQLstore(options);

app.use(session({
  key:config.session.key,
  secret:config.session.secret,
  store:sessionStore,
  resave:true,
  saveUninitialized: false,
  cookie: {
    maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
  },
}))

app.use(flash());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// 处理表单及文件上传的中间件
// app.use(require('express-formidable')({
//   uploadDir: path.join(__dirname, 'public/img'), // 上传文件目录
//   keepExtensions: true// 保留后缀
// }))

// //添加模板必须的三个变量
// app.use(function(req,res,next){
//   res.local.user = req.session.user;
//   res.local.success = req.flash('success').toString();
//   res.local.error = req.flash('error').toString();
// })

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// route
app.use('/', indexRouter);
app.use('/disk', diskRouter);
app.use('/users', usersRouter);

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
