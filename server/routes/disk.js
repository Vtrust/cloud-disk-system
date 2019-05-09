const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const router = express.Router();
const db = require('../model/db.js');
const sql = require('../model/sql.js');
const {responseClient} = require('../util');

/* GET root files. */
router.get('/root', function(req, res, next) {
  db.query(sql.getRootFile(3), function(err, resul, fields) {
    console.log(err, resul, fields);
    if (!err) {
      res.send(resul);
    }
  })
});

//GET folder files
router.get('/folder', function(req, res, next) {
  db.query(sql.getFolderFile(6), function(err, resul, fields) {
    console.log(err, resul, fields);
    if (!err) {
      res.send(resul);
    }
  })
});

//POST upload files
router.post('/upload', function(req, res, next) {
  //console.log(req.body, req.query);
  let action = req.query["action"],//查询还是上传
    hash = req.query["hash"],//文件MD5值
    suffix = req.query["suffix"],//文件后缀
    finish = req.query["finish"];//是否传输最后一块

  let path = `upload/my-disk-${suffix}${hash}.temp`;//上传中间路径
  let finishPath = `upload/my-disk-${hash}.${suffix}`;//上传完成路径

  if (action == "query") {
    console.log("query+++++++");
    if (fs.existsSync(finishPath)) res.send('ok'); //秒传成功可以返回json对象 eg:{ ret:1,test:"aaa" }
    else if (fs.existsSync(path)) res.send(fs.statSync(path).size + "");//返回已经上传的大小
    else res.send("0");
  } else if (action == "upload") {
    console.log("upload+++++");
    //判断是否传输完整个文件
    const ifFinish = () => {
      if(finish=='1'){//如果上传完毕
        fs.rename(path, finishPath);
      }
    }
    //upload
    let form = new formidable.IncomingForm();
    form.uploadDir = "upload";
    form.maxFileSize = 2 * 1024 * 1024 * 1024; //2GB
    form.parse(req, function(err, fields, files) {
      if (err) {
        //TODO abort的处理
        console.log('解析失败', err);
        res.send('error');
        return;
      }
      //TODO 删除所有无后缀文件
      let file = files.myfile;
      if (!fs.existsSync(path)) {//文件一块
        fs.rename(file.path, path, err=>{
          ifFinish();
        });
      } else {
        fs.appendFileSync(path, fs.readFileSync(file.path));
        fs.unlink(file.path,err=>{//删除刚刚上传的文件
          ifFinish();
        });

      }
      res.send('success');
    });

  }
});

module.exports = router;
