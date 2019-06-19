const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const router = express.Router();
const db = require('../model/db.js');
const sql = require('../model/sql.js');
const { responseClient } = require('../util');
const moment = require('moment');
const uuidv1 = require('uuid/v1');
const randomize = require('randomatic');
const jwt = require('jsonwebtoken');

const paramsError = (res) => {
  responseClient(res, 200, 1, "参数错误", {});
}

const dbError = (res, err) => {
  console.log(err);
  responseClient(res, 200, 1, "数据库读取错误", {});
}

//GET shareDetail
router.post('/shareDetail', function (req, res, next) {
  let { share_id, token } = req.body;
  console.log(share_id,token);
  let user_id;
  if(req.session.userInfo){
    user_id = req.session.userInfo.id;
  }
  if (share_id) {
    db.query(sql.getShareFileByShareId(share_id)).then(data => {
      console.log(data);
      if(data&&data.length<=0){
        responseClient(res, 200, 0, "", {type:-1});
        return;
      }
      data = data[0];
      let allInfo = {
        user_id: data.user_id,
        username: data.username,
        file_id: data.file_id,
        file_name: data.file_name,
        create_time: data.create_time,
        expire_time: data.expire_time
      }
      let partInfo = {
        username: data.username, 
        file_name: data.file_name,
        create_time: data.create_time,
      }
      //本人打开
      if (user_id&&data.user_id === user_id) {
        responseClient(res, 200, 0, "",{type:0,fileInfo:allInfo});
      } else {//非本人打开
        if(data&&data.expire_time&&moment().isAfter(data.expire_time)){
          responseClient(res, 200, 0, "", {type:-2});
        }
        if (data.token) {//加密的文件
          console.log('2222');
          if(token!=='undefined'){//提供了密码
            console.log('333');
            if(data.token===token){
              console.log('444');
              //生成访问token
              responseClient(res, 200, 0, "", {type:1,fileInfo:allInfo});
            }else{
              console.log('555');
              responseClient(res, 200, 0, "提取码错误", {type:2,fileInfo:partInfo});
            }
          }else{//未提供密码
            console.log('666');
            responseClient(res, 200, 0, "输入提取码", {type:3,fileInfo:partInfo});
          }
        } else {//非加密的文件
          responseClient(res, 200, 0, "", {type:4,fileInfo:allInfo});
        }
      }


    }).catch(err => {
      dbError(res, err);
    })
  } else {
    paramsError(res);
  }

});

//DELETE share 
router.post('/deleteShares', function (req, res, next) {
  let { share_id } = req.body;
  if (share_id) {
    db.query(sql.deleteShare(share_id)).then(data => {
      responseClient(res, 200, 0, "", {});
    }).catch(err => {
      console.log(err);
      responseClient(res, 200, 1, "数据库读取", {});
    })
  } else {
    responseClient(res, 200, 1, "参数错误", {});
  }

})

//GET share file
router.get('/shareFiles', function (req, res, next) {
  let user_id = req.session.userInfo.id;
  if (user_id) {
    db.query(sql.getShareFilesByUserId(user_id)).then(shareFiles => {
      console.log(shareFiles, '121212121');
      shareFiles.map(item=>{
        if(item.expire_time&&moment().isAfter(item.expire_time)){
          item.expired = true;
        }else{
          item.expired = false;
        }
      })

      responseClient(res, 200, 0, "", shareFiles); 
    }).catch(err => {
      console.log(err);
      responseClient(res, 200, 1, "数据读取出错", {});
    });
  } else {
    responseClient(res, 401, 1, "请先登录", {});
  }
})

//POST share file
router.post('/shareFiles', function (req, res, next) {
  //console.log(req.body);

  let { file_id, duration, security } = req.body;
  let user_id = req.session.userInfo.id;
  if (file_id && duration && security && user_id) {
    //console.log('ok');

    let newShare = {
      share_id: uuidv1(),
      user_id: user_id,
      file_id: file_id,
      create_time: moment().format("YYYY-MM-DD HH:mm:ss"),
    }

    if (duration !== '-1') {
      newShare.expire_time = moment(newShare.create_time).add(duration, 'days').format("YYYY-MM-DD HH:mm:ss");
    }
    if (security === '2') {
      newShare.token = randomize('Aa0', 4);
    }
    //console.log(newShare);

    db.query(sql.insertShare(), newShare).then(data => {
      //console.log(data);
      responseClient(res, 200, 0, "", newShare);
    }).catch(err => {
      //console.log(err);
    });
  } else {
    responseClient(res, 200, 1, "参数错误", {});
  }
})

//POST search file
router.post('/searchFiles', function (req, res, next) {
  let { keyword } = req.body;
  let user_id = req.session.userInfo.id;
  if (keyword && user_id) {
    db.query(sql.searchFiles(user_id, keyword)).then(files => {
      let data = {
        list: files
      }
      responseClient(res, 200, 0, "", data);
    })
  } else {
    responseClient(res, 200, 1, "参数错误", {})
  }
})

//POST file rename
router.post('/renameFile', function (req, res, next) {
  let { file_id, file_name } = req.body;
  console.log(req.body);
  
  if (file_id && file_name) {
    let update_time = moment().format("YYYY-MM-DD HH:mm:ss");
    db.query(sql.fileRename(file_id, file_name, update_time)).then(data => {
      responseClient(res, 200, 0, "", {});
    })
  } else {
    responseClient(res, 200, 1, "参数错误", {});
  }
})

/*POST delete file */
router.post('/deleteFiles', function (req, res, next) {
  let { file_id_list } = req.body;
  file_id_list = JSON.parse(file_id_list);
  if (file_id_list && file_id_list.length > 0) {
    //console.log('if');

    let files = [];
    let folders = [];
    file_id_list.map(item => {
      if (item.type === 1) {
        folders.push(item.file_id);
      }
      files.push(item.file_id)
    })
    //console.log(files, folders);

    function deleteFiles(files) {
      if (files && files.length > 0) {
        db.query(sql.deleteFileByIdList(files)).then(data => {
          responseClient(res, 200, 0, "删除成功", {});
        }).catch(err => {
          //console.log(err);
        });
      }
    }
    if (folders.length > 0) {//删除文件夹下文件
      db.query(sql.deleteFileByFolderIdList(folders)).then(data => {
        //删除文件和文件夹
        deleteFiles(files);
      }).catch(err => {
        //console.log(err);
      })
    } else {//只删除文件
      //删除文件和文件夹
      deleteFiles(files);
    }

  } else {
    //console.log('else');

    responseClient(res, 200, 1, "参数错误", {});
  }
});

/* GET files. */
router.get('/getFiles', function (req, res, next) {
  let folderId = req.query["folderId"];
  let userId = req.query["userId"]
  //console.log("getFiles", folderId, userId);

  if (folderId !== 'root') {//非根目录
    //console.log('not root');
    db.query(sql.getPathByFileId(folderId)).then((data) => {//找路径
      let path = data[0].path;
      path = path + "," + folderId;
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
        //console.log('test111111', paths);
        db.query(sql.getFolderFile(folderId, userId)).then((files) => {//找路径下的文件
          let data = {
            path: path,
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
    //console.log('root');
    db.query(sql.getRootFile(userId)).then((files) => {
      let data = {
        path: ",",
        paths: [],
        list: files
      }
      responseClient(res, 200, 0, '', data);
    }).catch((error) => {
      //TODO
    });
  }

});

// GET folders
router.get('/getFolders', function (req, res, next) {
  let folder_id = req.query["folder_id"];
  let user_id = req.session.userInfo.id;
  //console.log(folder_id, user_id, 'getFolders');

  if (folder_id === '') {//根目录
    db.query(sql.getRootFolders(user_id)).then(folders => {
      //console.log(folders);
    }).catch(err => {
      //console.log(err);
    })
  } else {//非根目录
    db.query(sql.getFolderFolders(user_id, folder_id)).then(folders => {
      //console.log(folders);
    }).catch(err => {
      //console.log(err);
    })
  }
  res.send(ok);
})

// GET type file
router.get('/typeFiles', function (req, res, next) {
  let type = req.query["type"];
  //console.log(type);

  let user_id = req.session.userInfo.id;
  //console.log(user_id);

  if (user_id && type) {
    let typeList = "";
    switch (type) {
      case 'doc': {
        typeList = "doc,docx,ppt,pptx,xlsx,xls,pdf";
        break;
      }
      case 'image': {
        typeList = "jpg,png,gif";
        break;
      }
      case 'audio': {
        typeList = "mp3";
        break;
      }
      case 'video': {
        typeList = "mp4,rmvb";
        break;
      }
      case 'other': {
        typeList = "folder,doc,docx,ppt,pptx,xlsx,xls,pdf,jpg,png,gif,mp3,mp4,rmvb";
        db.query(sql.getOtherFilesByType(user_id, typeList)).then(files => {
          let data = {
            list: files
          }
          responseClient(res, 200, 0, "", data);
        })
        return;
      }
      default: {
        responseClient(res, 200, 1, "参数错误", {});
      }
    }
    db.query(sql.getFilesByType(user_id, typeList)).then(files => {
      let data = {
        list: files
      }
      responseClient(res, 200, 0, "", data);
    })
  }
});

/*POST add folder */
router.post('/newFolder', function (req, res, next) {
  //console.log(req.body, '1212121');
  let { path, file_name } = req.body;
  let create_time = moment().format("YYYY-MM-DD HH:mm:ss");
  let folderId = path.split(',').pop();
  let newfile = {
    user_id: req.session.userInfo.id,
    file_name: file_name,
    type: 1,
    folder_id: folderId === '' ? null : folderId,
    path: path,
    state: 1,
    update_time: create_time,
    create_time: create_time
  }
  //console.log(newfile);
  // 先查询有没有同名文件
  db.query(sql.getFileByPathName(newfile.user_id, newfile.file_name, newfile.path)).then(data => {
    if (data && data.length > 0) {
      responseClient(res, 200, 1, "目录下不允许存在同名文件夹", {})
    } else {
      db.query(sql.insertFile(), newfile).then(data => {
        let resdata = {
          file_id: data.insertId,
          file_name: file_name,
          type: 1,
          suffix: "folder",
          folder_id: folderId === '' ? 'root' : folderId,
          size: "-",
          update_time: create_time
        }
        responseClient(res, 200, 0, "创建成功", { newFile: resdata });
      }).catch(error => {
        //console.log(error);

      })
    }
  }).catch(error => {
    //console.log(error);
  });
});

//POST upload files
router.post('/upload/v2', function (req, res, next) {
  //console.log('/upload/upload/upload');
  //解析
  let form = new formidable.IncomingForm();
  form.uploadDir = "upload";
  form.maxFileSize = 2 * 1024 * 1024 * 1024; //2GB
  form.parse(req, function (err, fields, files) {
    if (err) {
      //TODO abort的处理
      //console.log('解析失败', err);
      responseClient(res, 200, 1, "解析文件失败", err);
      return;
    }
    let { action, hash, suffix, finish, path, file_name } = fields;
    //console.log(fields);


    let tempPath = `upload/my-disk-${suffix}-${hash}.temp`;//上传中间路径
    let source_name = `my-disk-${hash}.${suffix}`;//存储名称
    let finishPath = `upload/${source_name}`;//上传完成路径
    //选择action
    switch (action) {
      case "query": {
        //console.log("query+++++++");
        db.query(sql.getSourceFileByName(source_name)).then(data => {
          //console.log(data, '2121');

          if (data && data.length > 0) {//秒传
            let create_time = moment().format("YYYY-MM-DD HH:mm:ss");
            let folderId = path.split(',').pop();
            let newfile = {
              user_id: req.session.userInfo.id,
              source_file_id: data[0].source_file_id,
              file_name: file_name,
              type: 0,
              folder_id: folderId === '' ? null : folderId,
              path: path,
              state: 1,
              update_time: create_time,
              create_time: create_time
            }
            //console.log('newfile', newfile);
            db.query(sql.increaseSourceFileCite(data[0].source_file_id));
            db.query(sql.insertFile(), newfile).then(data => {
              //console.log(data, 'newfile');
              responseClient(res, 200, 0, "秒传", { uploadType: 'flash' });
            })
          } else if (fs.existsSync(tempPath)) {
            responseClient(res, 200, 0, "断点续传", { uploadType: 'continue', uploadedSize: fs.statSync(tempPath).size });//断点续传
          } else {
            responseClient(res, 200, 0, "完全上传", { uploadType: 'full' });//完全上传
          }
        }).catch(err => {
          //console.log(err);
        })
      }
        break;
      case "upload": {
        //console.log("upload++++++");
        //判断是否传输完整个文件
        const ifFinish = () => {
          if (finish == '1') {//如果上传完毕
            fs.rename(tempPath, finishPath, err => {
              //console.log(err);
              //数据库写入
              let newSourceFile = {
                source_name: source_name,
                size: fs.statSync(finishPath).size,
                suffix: suffix,
                cite: 1,
                create_time: moment().format("YYYY-MM-DD HH:mm:ss")
              }
              //console.log('newSourceFile', newSourceFile);

              db.query(sql.insertSourceFile(), newSourceFile).then(data => {
                //console.log(data, 'insertSourceFile');
                let create_time = moment().format("YYYY-MM-DD HH:mm:ss");
                let folderId = path.split(',').pop();
                let newfile = {
                  user_id: req.session.userInfo.id,
                  source_file_id: data.insertId,
                  file_name: file_name,
                  type: 0,
                  folder_id: folderId === '' ? null : folderId,
                  path: path,
                  state: 1,
                  update_time: create_time,
                  create_time: create_time
                }

                //console.log('newfile', newfile);
                db.query(sql.insertFile(), newfile).then(data => {
                  //console.log(data);
                  responseClient(res, 200, 0, "文件上传成功", { file_id: data.insertId });
                }).catch(error => {
                  //console.log(error);
                });
              }).catch(error => {
                //console.log(error);
              })
            });
          } else {//未上传完
            responseClient(res, 200, 0, "分块上传成功", {});
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
      }
        break;
      default: {
        //console.log("action type wrong!");
        responseClient(res, 400, 1, "action type wrong!", {});
      }
    }
  });
});

//POST download file
router.post('/download', function (req, res, next) {
  //console.log(req.body);
  let { file_id } = req.body;
  db.query(sql.getSourceName(file_id)).then(data => {
    //console.log(data);
    if (data && data.length > 0) {
      let file = data[0];
      let path = `./upload/${file.source_name}`;
      res.download(path, file.file_name, function (err) {
        if (err) {
          //console.log(err);
        }
      })
    } else {
      responseClient(res, 200, 1, "无此文件", {})
    }

  })
});

//GET preview file
router.get('/preview', function (req, res, next) {
  let file_id = req.query["file_id"];
  //console.log(file_id);
  const options = {
    root: './upload/',
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };
  db.query(sql.getSourceName(file_id)).then(data => {
    if (data && data.length > 0) {
      //console.log(data);

      let file = data[0];
      let fileName = file.source_name;
      res.sendFile(fileName, options, function (err) {
        if (err) {
          next(err);
        } else {
          //console.log('Sent:', fileName);
        }
      });
    } else {
      responseClient(res, 200, 1, "无此文件", {})
    }
  }).catch(err => {
    //console.log(err);

  })
});

//POST move file
router.post('/move', function (req, res, next) {
  let { file_id_list, folder_id } = req.body;
  if (file_id_list && folder_id) {
    file_id_list = JSON.parse(file_id_list);//解析
    if (file_id_list.indexOf(folder_id) === -1) {
      responseClient(res, 200, 1, "不能把文件移动到选定的文件夹中", {});
      return;
    }
    db.query(sql.getPathByFileId(folder_id)).then(data => {
      //console.log(data);
      let path = data[0].path;
      path = path + ',' + folder_id;
      let i = 0;
      file_id_list.forEach(file_id => {
        db.query(sql.moveFile(file_id, folder_id, path)).then(data => {
          ++i;
          if (i === file_id_list.length) {
            responseClient(res, 200, 1, "移动完成", {});
            return;
          }
        }).catch(err => {
          //console.log(err);
          responseClient(res, 200, 1, "写数据库错误，移动失败", {});
          return;
        })
      });
    }).catch(err => {
      responseClient(res, 200, 1, "查数据库错误，移动失败", {});
      return;
    })
  } else {
    responseClient(res, 200, 1, "参数错误，移动失败", {});
    return;
  }
});

//POST upload files
router.post('/upload', function (req, res, next) {
  //console.log(req.body);
  let action = req.query["action"],//查询还是上传
    hash = req.query["hash"],//文件MD5值
    suffix = req.query["suffix"],//文件后缀
    finish = req.query["finish"];//是否传输最后一块

  let path = `upload/my-disk-${suffix}${hash}.temp`;//上传中间路径
  let finishPath = `upload/my-disk-${hash}.${suffix}`;//上传完成路径

  if (action == "query") {
    //console.log("query+++++++");
    if (fs.existsSync(finishPath)) res.send('ok'); //秒传成功可以返回json对象 eg:{ ret:1,test:"aaa" }
    else if (fs.existsSync(path)) res.send(fs.statSync(path).size + "");//返回已经上传的大小
    else res.send("0");
  } else if (action == "upload") {
    //console.log("upload+++++");
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
        //console.log('解析失败', err);
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