const express = require('express');
const formidable  = require('formidable');
const fs = require('fs');
const router = express.Router();
const db = require('../model/db.js');
const sql = require('../model/sql.js');

/* GET root files. */
router.get('/root', function(req, res, next) {
  db.query(sql.getRootFile(3),function(err,resul,fields){
    console.log(err,resul,fields);
    if(!err){
      res.send(resul);
    }
  })
});

//GET folder files
router.get('/folder', function(req, res, next) {
  db.query(sql.getFolderFile(6),function(err,resul,fields){
    console.log(err,resul,fields);
    if(!err){
      res.send(resul);
    }
  })
});

//POST upload files
router.post('/upload',function(req,res,next){
  console.log(req.body);
  let form = new formidable.IncomingForm();
  form.uploadDir = "upload";
  form.maxFileSize = 2*1024*1024*1024; //2GB

  form.parse(req,function(err,fields,files){
    let file = files.myfile;
    let path = 'upload/'+ file.name;
    if (!fs.existsSync(path)){
        fs.rename(file.path, path);
    }else{
        fs.appendFileSync(path, fs.readFileSync(file.path));//数据追加到之前的文件
        fs.unlink(file.path);//删除刚刚上传的文件
    }

    if(err){
        console.log('解析失败',err);
    }
    let upfile;
    console.log('1111',fields,files.myfile,path);
    res.send('success');
  });
});

module.exports = router;
