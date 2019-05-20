const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const router = express.Router();
const db = require('../model/db.js');
const sql = require('../model/sql.js');
const { responseClient } = require('../util');
var multipart = require('connect-multiparty');

var multipartMiddleware = multipart();


/* GET root files. */
router.get('/getFiles', function (req, res, next) {
  let folderId = req.query["folderId"];
  let userId = req.query["userId"]
  console.log("getFiles", folderId, userId);

  if (folderId !== 'root') {//非根目录
    console.log('not root');
    db.query(sql.getPathByFileId(folderId)).then((data) => {//找路径
      let path = data[0].path;
      path = path+","+folderId;
      let pathFlag = path.split(',');
      pathFlag.shift();
      db.query(sql.getPathInfoByPath(path)).then((pathInfo) => {//找路径名
        let paths = [];
        for (let i = 0; i < pathFlag.length; i++) {
          for (let j = 0; j < pathInfo.length; j++) {
            if (pathFlag[i] == pathInfo[j].file_id) {
              paths.push(pathInfo[j]);
            }
          }
        }
        console.log('test111111', paths);
        db.query(sql.getFolderFile(folderId, userId)).then((files) => {//找路径下的文件
          let data = {
            path : path,
            paths: paths,
            list: files
          }
          responseClient(res, 200, 0, '', data);
        }).catch((error) => {
          //TODO 找文件出错
        });
      }).catch((error) => {
        //TODO 找路径名出错
      });
    }).catch((error) => {
      //TODO 找路径出错
    });
  } else {
    console.log('root');
    db.query(sql.getRootFile(userId)).then((files) => {
      let data = {
        path:",",
        paths: [],
        list: files
      }
      responseClient(res, 200, 0, '', data);
    }).catch((error) => {
      //TODO
    });
  }

});

//GET folder files
router.get('/folder', function (req, res, next) {
  db.query(sql.getFolderFile(6), function (err, resul, fields) {
    console.log(err, resul, fields);
    if (!err) {
      res.send(resul);
    }
  })
});

//POST upload files
router.post('/upload/v2', function (req, res, next) {
  console.log('/upload/upload/upload');
  //解析
  let form = new formidable.IncomingForm();
  form.uploadDir = "upload";
  form.maxFileSize = 2 * 1024 * 1024 * 1024; //2GB
  form.parse(req, function (err, fields, files) {
    if (err) {
      //TODO abort的处理
      console.log('解析失败', err);
      responseClient(res, 200, 1, "解析文件失败", err);
      return;
    }
    let { action, hash, suffix, finish,path } = fields;
    console.log(fields);
    

    let tempPath = `upload/my-disk-${suffix}-${hash}.temp`;//上传中间路径
    let finishPath = `upload/my-disk-${hash}.${suffix}`;//上传完成路径
    //选择action
    switch (action) {
      case "query": {
        console.log("query+++++++");
        if (fs.existsSync(finishPath)) {
          //数据库写入
          responseClient(res, 200, 0, "秒传", { uploadType: 'flash' }); //秒传
        } else if (fs.existsSync(tempPath)) {
          responseClient(res, 200, 0, "断点续传", { uploadType: 'continue', uploadedSize: fs.statSync(tempPath).size });//断点续传
        } else {
          responseClient(res, 200, 0, "完全上传", { uploadType: 'full' });//完全上传
        }
      }
        break;
      case "upload": {
        console.log("upload++++++");
        //判断是否传输完整个文件
        const ifFinish = () => {
          if (finish == '1') {//如果上传完毕
            fs.rename(tempPath, finishPath, err => {
              console.log(err);
            });
            //数据库写入
          }
        }
        //TODO 删除所有无后缀文件

        let chunk = files.chunk;

        if (!fs.existsSync(tempPath)) {//文件第一一块
          fs.rename(chunk.path, tempPath, err => {
            ifFinish();
          });
        } else {
          fs.appendFileSync(tempPath, fs.readFileSync(chunk.path));
          fs.unlink(chunk.path, err => {//删除刚刚上传的文件
            ifFinish();
          })
        }
        responseClient(res, 200, 0, "分块上传成功", {});
      }
        break;
      default: {
        console.log("action type wrong!");
        responseClient(res, 400, 1, "action type wrong!", {});
      }
    }
  });
});


//POST upload files
router.post('/upload', function (req, res, next) {
  console.log(req.body);
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
      if (finish == '1') {//如果上传完毕
        fs.rename(path, finishPath);
      }
    }
    //upload
    let form = new formidable.IncomingForm();
    form.uploadDir = "upload";
    form.maxFileSize = 2 * 1024 * 1024 * 1024; //2GB
    form.parse(req, function (err, fields, files) {
      if (err) {
        //TODO abort的处理
        console.log('解析失败', err);
        res.send('error');
        return;
      }
      //TODO 删除所有无后缀文件
      let file = files.myfile;
      if (!fs.existsSync(path)) {//文件一块
        fs.rename(file.path, path, err => {
          ifFinish();
        });
      } else {
        fs.appendFileSync(path, fs.readFileSync(file.path));
        fs.unlink(file.path, err => {//删除刚刚上传的文件
          ifFinish();
        });

      }
      res.send('success');
    });

  }
});

module.exports = router;
