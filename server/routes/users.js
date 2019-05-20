const express = require('express');
const router = express.Router();
const db = require('../model/db.js');
const sql = require('../model/sql.js');
const { responseClient, md5, MD5_SUFFIX } = require('../util');

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
  db
    .query(sql.getUserInfoByNameAndPwd(username, md5(password + MD5_SUFFIX))).then(userinfo => {
      if (!userinfo) {
        responseClient(res, 200, 1, '用户名或密码错误');
        return;
      }
      //登陆成功
      let data = {
        id: userinfo[0].user_id,
        username: userinfo[0].user_name,
        level: userinfo[0].level
      };

      //登录成功后设置session
      req.session.userInfo = data;

      responseClient(res, 200, 0, '登录成功', data);
      return;
    })
    .catch(err => {
      responseClient(res);
      return;
    })
});

// POST user register
router.post('/register', (req, res) => {
  let { username, password, phone, email } = req.body;
  console.log(username, password, phone, email);
  if (!username) {
    responseClient(res, 400, 2, '用户名不可为空');
  }
  if (!password) {
    responseClient(res, 400, 2, '密码不可为空');
  }
  db.query(sql.getUserInfoByName(username)).then(data => {
    if (data) {
      responseClient(res, 200, 1, '用户名已存在');
      return;
    }

    let user = {
      user_name: username,
      user_password: md5(password + MD5_SUFFIX),
      level: 1
    }

    db
      .query(sql.insertUser(), user).then(data => {
        //保存到session
        let newUser = {
          id: data.insertId,
          username: username,
          level: 1
        }
        req.session.userInfo = newUser;
        responseClient(res, 200, 0, '注册成功', newUser);
        return;
      })
      .catch(err => {
        console.log(err);
        responseClient(res);
        return;
      });
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
  let user_id = 3;
  db
    .query(sql.getUserInfoById(user_id)).then(data => {
      res.send(data);
    })
    .catch(err => {
      console.log(err);
    });
});

// router.get('/login',function(req,res){
//   //设置session
//   req.session.userinfo='张三';
//   res.send("登陆成功！");
// });

// router.get('/loginOut',function(req,res){
//   //注销session
//   req.session.destroy(function(err){
//       res.send("退出登录！"+err);
//   });
// });

// router.get('/',function(req,res){
//   //获取session
//   if(req.session.userinfo){
//       res.send("hello "+req.session.userinfo+"，welcome to index");
//   }else{
//       res.send("未登陆");
//   }
// });
module.exports = router;
