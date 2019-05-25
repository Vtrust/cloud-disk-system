import moment from "moment";
import axios from 'axios';
const instance = axios.create({
  timeout: 1000,
});

export const typeToIconType = (type) => {
  switch (type) {
    //文档
    case 'doc':
      return 'file-word';
    case 'docx':
      return 'file-word';
    case 'pdf':
      return 'file-pdf';
    //图片
    case 'jpg':
      return 'file-image';
    case 'folder':
      return 'folder';
    case 'zip':
      return 'file-zip';
    default:
      return 'file-unknown';
  }
}

//格式化数字输出,将数字转为合适的单位输出,默认按照1024层级转为文件单位输出
export const formatSize = (size) => {
  let UNITS_FILE_SIZE = ["B", "KB", "MB", "GB", "TB", "PB", "EB"];
  let unit = 0;
  let value = size;
  while (value >= 1024) {
    unit++;
    value = parseInt(value / 1024 * 10) / 10;
  }
  return value + UNITS_FILE_SIZE[unit];
}

//格式化文件列表
export const formatFileList = (fileList, sortType) => {
  //添加辅助参数
  fileList.map(item => {
    item.checked = false;
    item.update = moment(item.update_time).format('YYYY/MM/DD HH:mm');
    item.suffix = item.type === 1 ? "folder" : typeToIconType(item.suffix);
  })
  //时间排序
  let sortByTime = (a, b) => {

    let res = (a.update < b.update) ? 1 : -1;
    return res;
  }
  let old = [...fileList];

  fileList.sort(sortByTime);

  //先选出文件夹
  let folder = fileList.filter(item => {
    return item.type === 1;
  })
  //再选出文件
  let files = fileList.filter(item => {
    return item.type === 0;
  })
  return folder.concat(files);
}

//通过标签下载文件
export const linkDownload = (file_id) =>{
  axios.post('/api/disk/download',{
    file_id:file_id
  }, {
    responseType: 'blob'
  }).then(res => {
    console.log(res);

    const content = res.data
    const blob = new Blob([content])

    let fileName = res.headers['content-disposition'].split("filename=")[1].split("\"")[1];

    console.log(fileName);

    if (!fileName) {
      fileName = 'unknow'
    }

    if ('download' in document.createElement('a')) { // 非IE下载
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    } else { // IE10+下载
      navigator.msSaveBlob(blob, fileName)
    }
  });
}