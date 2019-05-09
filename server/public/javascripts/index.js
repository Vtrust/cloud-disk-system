function log(msg) {
  document.getElementById('log').innerHTML += (msg != undefined ? msg : "") + "<br />";
}

let choosefile = document.getElementById('c-file');
document.getElementById('upload-target').onclick = function() {
  choosefile.click();
}

let chunkSize = 2 * 1024 * 1024; //2MB
let spark = new SparkMD5.ArrayBuffer();
let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice; //文件分割

choosefile.onchange = e => {
  log('选择文件')
  let files = e.target.files;
  for (let i = 0; i < files.length; i++) {
    html5_upload(files[i]);
  }
  log('清空input value');
  choosefile.value = '';
}

let uploadView = document.getElementById('upload-view');

function addTaskToView(name, size) {
  let fsize = formatSize(size);
  let task = document.createElement("div");
  task.classList.add('task');
  task.innerHTML = `<div class="filename">${name}</div><div class="filesize">${fsize}</div><div class="u-progress"><div class="u-state"><div class="u-now"></div></div></div><div class="u-num">0.0%</div><div class="u-cancel">传输中</div>`
  uploadView.appendChild(task);
}

let uploadNum = 0;

function html5_upload(file) {
  let thisNum = uploadNum++;
  addTaskToView(file.name, file.size);
  log(file.name + " 添加上传任务");
  //log(file.name + " 随机id用于文件合并");
  // let fid = Date.now();
  // log(file.name + " 开始分块上传 "+ new Date().toLocaleTimeString());
  let unow = {
    dom1:document.getElementsByClassName('u-now')[thisNum],
    dom2:document.getElementsByClassName('u-num')[thisNum],
    dom3:document.getElementsByClassName('u-cancel')[thisNum]
  }
  //chunksUpload(file, fid, '/disk/upload',unow);

  log(file.name+" 查询MD5...");
  computMD5(file,function(md5,time){
    log(file.name+" MD5:"+md5+"time:"+time);
    //TODO
    log(file.name+" 开始分块上传");
    chunksUpload(file, md5, '/disk/upload',unow);
  });


  // let xhr = new XMLHttpRequest();
  // //上传进度
  // xhr.upload.addEventListener("progress", e => {
  //   //console.log('progress', e.loaded/e.total);
  //   let unow = document.getElementsByClassName('u-now')[thisNum];
  //   let p = Math.round((e.loaded / e.total) * 1000) / 10 + '%'
  //   unow.style.width = p;
  //   let unum = document.getElementsByClassName('u-num')[thisNum];
  //   unum.innerHTML = p;
  // }, false);
  // //上传完成
  // xhr.addEventListener("load", e => {
  //   //获取服务器上传成功事件
  //   let text = e.target.responseText;
  //   console.log('success', text)
  // }, false);
  // //上传失败
  // xhr.addEventListener("error", e => {
  //   console.log('error', e);
  // }, false);
  // xhr.addEventListener("abort", e => {
  //   console.log('abort', e);
  // }, false);
  //
  // let fd = new FormData;
  // fd.append("file", file);
  // xhr.open("POST", "/disk/upload");
  // xhr.send(fd);
}

function chunksUpload(file, hash, url, dom) {
  let size = file.size,//文件大小
    chunks = Math.ceil(size / chunkSize),//分块数量
    currentChunk = 0,//当前上传块
    suffix = file.name.split('.').pop(),//文件后缀
    abort = false,//发生中断
    finish = (chunks==1)?1:0,//上传最后一块标记
    qurry = "",//上传链接
    start = 0,//当前块开始下标
    end = 0,//当前块结束下标
    times = Date.now();//开始时间

  console.log(file,suffix);
  //查询否可以秒传
  let ifContinueUpload = callback => {
    query = `?action=query&hash=${hash}&suffix=${suffix}&finish=${finish}`;
    let xhr = new XMLHttpRequest();//Ajax模块
    xhr.addEventListener("load", e => {
      let text = e.target.responseText;
      if(text == '0'){
        log('完全上传');
        callback&&callback();
      }else if(text == 'ok'){
        log('秒传');
        dom.dom1.style.width = "100%";
        dom.dom2.innerHTML = "100%";
      }else if(parseInt(text)>0){
        log('断点续传');
        let doneSize = parseInt(text);
        currentChunk = Math.floor(doneSize/chunkSize);
        start = doneSize;
        callback&&callback();
      }
    }, false);
    xhr.addEventListener("error", e => {
      console.log('error', e);
      return;
    }, false);
    xhr.open("POST", url+query);
    xhr.send();
  }

  //分块上传
  let upload = (chunk, callback) => { //分块上传函数
    log(file.name+' 上传分块 '+(currentChunk+1)+"/"+chunks+' ');
    query = `?action=upload&hash=${hash}&suffix=${suffix}&finish=${finish}`
    let xhr = new XMLHttpRequest();//Ajax模块
    //上传进度
    xhr.upload.addEventListener("progress", e => {
      console.log('progress');
      if(abort) return;
      //更新dom
      let state = parseInt((currentChunk+ e.loaded / e.total)/chunks*10000)/100+'%';
      dom.dom1.style.width = state;
      dom.dom2.innerHTML = state;
    }, false);
    //上传完成
    xhr.addEventListener("load", e => {
      //获取服务器上传成功事件
      let text = e.target.responseText;
      console.log('success', text)
      callback && callback();
    }, false);
    //上传失败
    xhr.addEventListener("error", e => {
      console.log('error', e);
    }, false);
    xhr.addEventListener("abort", e => {
      return console.log('abort', e);
    }, false);

    let fd = new FormData;
    fd.append("myfile", chunk, hash);
    xhr.open("POST", url+query);
    xhr.send(fd);
    //取消按钮
    dom.dom3.onclick = function(){
      if(abort==false){
        abort = true;
        dom.dom3.innerHTML = '继续'
        xhr.abort();
      }else{
        abort = false;
        dom.dom3.innerHTML = '暂停'
        ifContinueUpload(startUpload);
      }

      //query = "?action=abort";
      //xhr.open("POST", url+query);

    }
  }

  let startUpload = () => { //分块上传前处理
    if (start >= size) {
      log(file.name+' 上传完毕 '+new Date().toLocaleTimeString()+' 总时长'+(Date.now()-times));
      return; //传送完毕
    }
    if(currentChunk==chunks-1){
      finish = 1;
    }
    //计算下一块末尾
    end = start + chunkSize;
    if (end > size) {
      end = size;
    }
    //获取传送块
    let chunk = blobSlice.call(file, start, end);
    //上传
    upload(chunk, nextUpload);
  }

  let nextUpload = () => { //分块上传后处理
    currentChunk++;
    start = end;
    startUpload();
  }

ifContinueUpload(startUpload);

}








//==============================================================================
//计算文件MD5
function computMD5(file, callback, progress) {
  let size = file.size,
    chunks = Math.ceil(size / chunkSize),
    currentChunk = 0,
    fr = new FileReader(),
    startTime = Date.now();

  spark.reset();

  //分片计算MD5
  fr.onload = e => {
    spark.append(e.target.result);
    currentChunk++;
    progress && progress(currentChunk / chunks);

    if (currentChunk < chunks) {
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



//格式化数字输出,将数字转为合适的单位输出,默认按照1024层级转为文件单位输出
function formatSize(size) {
  let UNITS_FILE_SIZE = ["B", "KB", "MB", "GB", "TB", "PB", "EB"];
  let unit = 0;
  let value = size;
  while (value > 1024) {
    unit++;
    value = parseInt(value / 1024 * 10) / 10;
  }
  return value + UNITS_FILE_SIZE[unit];
}
