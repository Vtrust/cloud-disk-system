const express = require('express');
const router = express.Router();
const db = require('../model/db.js');
const sql = require('../model/sql.js');
const moment = require('moment');
const { responseClient, md5, MD5_SUFFIX } = require('../util');


router.post('/login', (req, res) => {
  let { username, password } = req.body;

  req.session.userInfo = userInfo;//登录成功后设置session

  responseClient(res, 200, 0, '登录成功', resdata);
});

// POST user login
router.post('/login', (req, res) => {
  let { username, password } = req.body;
  if (!username) {
    responseClient(res, 400, 2, '用户名不可为空');
    return;
  }
  if (!password) {
    responseClient(res, 400, 2, '密码不可为空');
  }
  db.query(sql.getUserInfoByNameAndPwd(username, md5(password + MD5_SUFFIX))).then(data => {
    console.log(data, 'userinfo');

    if (!data) {
      responseClient(res, 200, 1, '用户名或密码错误');
      return;
    }
    //登陆成功
    let resdata = {
      id: data[0].user_id,
      username: data[0].user_name,
      level: data[0].level
    };

    //登录成功后设置session
    req.session.userInfo = resdata;

    responseClient(res, 200, 0, '登录成功', resdata);
    return;
  }).catch(err => {
    responseClient(res);
    return;
  })
});

// POST user register
router.post('/register', (req, res) => {
  let { username, password, gender, phone, email } = req.body;
  console.log(username, password, phone, email);
  if (!username) {
    responseClient(res, 400, 2, '用户名不可为空');
  }
  if (!password) {
    responseClient(res, 400, 2, '密码不可为空');
  }
  db.query(sql.getUserInfoByName(username)).then(data => {


    if (data && data.length > 0) {
      responseClient(res, 200, 1, '用户名已存在');
      return;
    }
    if (email) {
      console.log(data, 'data');
    }

    let user = {
      username: username,
      password: md5(password + MD5_SUFFIX),
      gender: (gender ? gender : 0),
      email: (email !== 'undefined' ? email : ''),
      level: 1,
      create_time: moment().format("YYYY-MM-DD HH:mm:ss")
    }

    console.log(user);


    db.query(sql.insertUser(), user).then(data => {
      //保存到session
      let newUser = {
        id: data.insertId,
        username: username,
        level: 1
      }
      req.session.userInfo = newUser;
      responseClient(res, 200, 0, '注册成功', newUser);
      return;
    }).catch(err => {
      console.log(err);
      responseClient(res);
      return;
    });
  }).catch(error => {
    console.log(error);

  });
});

// GET user logout
router.get('/logout', function (req, res) {
  req.session.destroy();
  responseClient(res, 200, 0, "登出成功", {});
});

//GET 用户验证
router.get('/userInfo', function (req, res) {
  if (req.session.userInfo) {
    responseClient(res, 200, 0, '', req.session.userInfo)
  } else {
    responseClient(res, 200, 1, '请重新登录', req.session.userInfo)
  }
});

// GET user info
router.get('/info', function (req, res, next) {
  let user_id = 37;
  db
    .query(sql.getUserInfoById(user_id)).then(data => {
      res.send(data);
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
