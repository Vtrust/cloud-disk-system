import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Upload, message, Button, Icon, Checkbox, Progress } from 'antd';
import { Link } from "react-router-dom";
import SparkMD5 from "spark-md5";
import axios from 'axios';

//md5生成工具
let spark = new SparkMD5.ArrayBuffer();

let computMD5 = (file, callback, progress) => {//分片计算文件MD5
  let size = file.size,
    chunkSize = 8 * 1024 * 1024, //8MB
    chunkNum = Math.ceil(size / chunkSize),//分片块数量
    blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,//浏览器兼容
    currentChunk = 0,//当前计算块
    fr = new FileReader(),//HTML5读取文件
    startTime = Date.now();//开始上传时间

  spark.reset();

  //分片计算MD5
  fr.onload = e => {
    spark.append(e.target.result);
    currentChunk++;
    progress && progress(currentChunk / chunkNum);

    if (currentChunk < chunkNum) {
      loadNext();
    } else {
      callback && callback(spark.end(), Date.now() - startTime);
    }
  }

  fr.onerroe = callback;

  function loadNext() {
    let start = currentChunk * chunkSize,
      end = ((start + chunkSize) >= size) ? size : start + chunkSize;

    fr.readAsArrayBuffer(blobSlice.call(file, start, end));
  }

  loadNext();
}


class Home extends Component {
  constructor(props) {
    super(props);
    this.s1click = this.s1click.bind(this);
    this.s2click = this.s2click.bind(this);
    this.state = {
      beforeUpload: false,
      md5Progress: 0,
    }
  }
  s1click(e) {
    console.log('s1 click');
  }
  s2click(e) {
    //e.preventDefault();
    //e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    console.log('s2 click');
  }




  //antd上传开始前 计算文件MD5值
  beforeUpload = (file, fileList) => {
    this.setState({
      beforeUpload: true
    })
    console.log('beforeUpload1');
    console.log(file, fileList);

    return new Promise((res, rej) => {
      //计算文件MD5
      computMD5(file, (md5, time) => {
        console.log('md5', md5, time);
        file.md5 = md5;//给文件添加MD5属性
        res(file);
      }, (num) => {
        console.log('MD5计算进度', num);
        let progress = Math.floor(num * 100);
        this.setState({
          md5Progress: progress,
        })
      })
      console.log('beforeUpload2');
      //return false;
    });
  }


  //覆盖antd上传方法
  customRequest = (action) => {
    console.log('customRequest');
    console.log(action);

    //HTML5分块上传
    this.chuncksUpload(action, 2)
    // let i = 0;
    // let interval = setInterval(() => {
    //   action.onProgress({ percent: ++i }, action.file);
    //   //console.log(i);

    //   if (i == 100) {
    //     action.onSuccess("ok!", action.file);
    //     clearInterval(interval);
    //   }
    // }, 10);

  }

  //分块上传
  chuncksUpload = (action, chunkSize) => {
    chunkSize = chunkSize * 1024 * 1024;//分块大小
    let { file } = action,
      size = file.size,
      chunkNum = Math.ceil(size / chunkSize),//分块数量
      currentChunk = 0,//当前上传块
      blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,//浏览器兼容切块
      finish = (chunkNum == 1) ? 1 : 0,//上传最后一块标记
      start = 0,//当前块开始下标
      end = 0,//当前块结束下标
      times = Date.now(),//开始时间
      abort = false,//中断标记
      suffix = file.name.split('.').pop(),//文件后缀
      url = "/api/disk/upload/v2";//请求链接参数

    console.log('分块上传开始', file.name);

    //选择上传方式 秒传/断点续传/完全上传
    let chooseUploadMethod = (callback) => {
      let formData = new FormData();
      formData.append("action", "query");
      formData.append("hash", file.md5);
      formData.append("suffix", suffix);
      formData.append("finish", finish);

      axios.post(url, formData).then((response) => {
        console.log(response);
        if (response && response.code === 0) {
          switch (response.data.uploadType) {
            case "full": {
              console.log('完全上传');
              callback && callback();
            }
              break;
            case "continue": {
              //设置上传进度
              console.log('断点续传');
              let uploadedSize = response.data.uploadedSize;
              currentChunk = Math.floor(uploadedSize / chunkSize);
              start = uploadedSize;
              callback && callback();
            }
              break;
            case "flash": {
              console.log('闪传');
              action.onProgress({ percent: 100 }, file);
              action.onSuccess("upload OK", file);
            }
              break;
            default:
              console.log("后台返回参数错误！");
          }
        }
      }).catch(onError);
    }

    //单块上传函数
    let chunkUpload = (chunk, callback) => {
      console.log(file.name + ' 上传分块 ' + (currentChunk + 1) + "/" + chunkNum + ' ');
      let formData = new FormData;
      formData.append("action", "upload");
      formData.append("hash", file.md5);
      formData.append("suffix", suffix);
      formData.append("finish", finish);
      formData.append("chunk", chunk);

      axios.post(url, formData, {
        onUploadProgress: ({ total, loaded }) => {
          console.log(Math.round((currentChunk + loaded / total) / chunkNum * 100).toFixed(2),'12121212122121212')
          action.onProgress({ percent: Math.round((currentChunk + loaded / total) / chunkNum * 100) }, file);
        },
      }).then((response) => {
        if (response && response.code === 0) {
          callback && callback();
        }
      }).catch(onError);
    }

    let startUpload = () => {//上传前准备
      if (start >= size) {
        action.onSuccess("upload OK", file);
        console.log(file.name + ' 上传完毕 ' + new Date().toLocaleTimeString() + ' 总时长' + (Date.now() - times));
        return;
      }
      if (currentChunk === chunkNum - 1) {
        finish = 1;//标记上传最后一块
      }
      //计算下一块末尾
      end = start + chunkSize;
      if (end > size) {
        end = size;
      }
      //获取传送块
      let chunk = blobSlice.call(file, start, end);
      //上传块
      chunkUpload(chunk, nextUpload);
    }

    let nextUpload = () => { //分块上传后处理
      currentChunk++;
      start = end;
      startUpload();
    }

    let onError = (err) => {
      console.log('onError', err);
      action.onError('网络错误',action.file);
    }

    chooseUploadMethod(startUpload);
  }







  render() {
    //antd参数
    const props = {
      name: 'file',
      action: '/api/disk/upload',
      headers: {
        authorization: 'authorization-text',
      },
      multiple: true,
      beforeUpload: this.beforeUpload,
      customRequest: this.customRequest,
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    return (
      <div>
        <Upload {...props}>
          <Button>
            <Icon type="upload" /> Click to Upload
          </Button>
          <Progress percent={this.state.md5Progress} />
        </Upload>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {

  };
}

export default connect(
  mapStateToProps,
)(Home);