const express = require('express');
const router = express.Router();
const db = require('../model/db.js');
const sql = require('../model/sql.js');
const {responseClient,md5,MD5_SUFFIX} = require('../util');

// POST user login
router.post('/login',(req,res)=>{
  let{userName,password}=req.body;
  if(!userName){
    responseClient(res,400,2,'用户名不可为空');
    return;
  }
  if(!password){
    responseClient(res,400,2,'密码不可为空');
  }
  db.query(sql.getUserInfoByNameAndPwd(userName,md5(password + MD5_SUFFIX))).then(userinfo=>{
    console.log(userinfo);
    if(!userinfo){
      responseClient(res,200,1,'用户名或密码错误');
      return;
    }
    //登陆成功
    let data = {};
    data.username = userinfo[0].user_name;
    data.userType = userinfo[0].level;
    data.userId = userinfo[0].user_id;
    //登录成功后设置session
    req.session.userInfo = data;
    responseClient(res, 200, 0, '登录成功', data);
    return;
  }).catch(err=>{
    responseClient(res);
    return;
  })
});

// POST user register
router.post('/register',(req,res)=>{
  let{userName,password}=req.body;
  if(!userName){
    responseClient(res,400,2,'用户名不可为空');
    return;
  }
  if(!password){
    responseClient(res,400,2,'密码不可为空');
  }
  db.query(sql.getUserInfoByName(userName)).then(data=>{
    //console.log(data);
    if(data){
      responseClient(res,200,1,'用户名已存在');
      return;
    }
    let user = {
      user_name:userName,
      user_password: md5(password + MD5_SUFFIX),
      level:1
    }
    //console.log(user);
    db.query(sql.insertUser(),user).then(data=>{
      console.log(data);
      responseClient(res, 200, 0, '注册成功', '');
      return;
    }).catch(err=>{
      console.log(err);
      responseClient(res);
      return;
    });
  });
});

// GET user logout
router.get('/logout',function (req,res) {
    req.session.destroy();
    res.redirect('/');
});

//用户验证
router.get('/userInfo',function (req,res) {
    if(req.session.userInfo){
        responseClient(res,200,0,'',req.session.userInfo)
    }else{
        responseClient(res,200,1,'请重新登录',req.session.userInfo)
    }
});

// // GET user info
// router.get('/info', function(req, res, next) {
//   let user_id = 3;
//   db.query(sql.getUserInfoById(user_id)).then(data=>{
//     res.send(data);
//   }).catch(err=>{
//     console.log(err);
//   });
// });

module.exports = router;
