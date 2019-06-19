import moment from "moment";
import axios from 'axios';

const fileIcon = {
  //doc
  'doc': 'file-word',
  'docx': 'file-word',
  'ppt': 'file-ppt',
  'pptx': 'file-ppt',
  'xlsx': 'file-excel',
  'xls': 'file-excel',
  'pdf': 'file-pdf',
  //image
  'jpg': 'file-image',
  'png': 'file-image',
  'gif': 'file-image',
  //audio
  'mp3': 'customer-service',
  //video
  'mp4': 'play-square',
  'rmvb': 'play-square',
  //zip
  'zip': 'file-zip',
  //文件夹
  'folder': 'folder',
  //应用
  'exe': 'windows',
}


const fileShow = {// -1：不支持 4：office 1：pdf 2:图片 3:音频视频 不要使用0
  //doc
  'doc': 4,
  'docx': 4,
  'ppt': 4,
  'pptx': 4,
  'xlsx': 4,
  'xls': 4,
  'pdf': 1,
  //image
  'jpg': 2,
  'png': 2,
  'gif': 2,
  //audio
  'mp3': 3,
  //video
  'mp4': 3,
  'rmvb': -1,
  //zip
  'zip': -1,
  //文件夹
  'folder': -1,
  //应用
  'exe': -1,
}

export const previewFileType = (type) => {
  if (fileShow[type]) {
    return fileShow[type]
  } else {
    return -1;
  }
}

export const previewFileTypeByName = (file_name) => {
  console.log('previewFileTypeByName',file_name);
  
  let pat = /\.(\w+)$/;
  let suffix = file_name.match(pat);
  if (suffix&&fileShow[suffix[1]]) {
    return fileShow[suffix[1]]
  } else {
    return -1;
  }
}

export const typeToIconType = (type) => {
  if (fileIcon[type]) {
    return fileIcon[type]
  } else {
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
export const formatShareFiles = (shareFiles) => {

    shareFiles.map(item => {
    let pat = /\.(\w+)$/;
    let suffix = item.file_name.match(pat);
    item.icon = typeToIconType(suffix&&suffix[1]);
    item.create_time = moment(item.create_time).format('YYYY/MM/DD HH:mm');
    item.expire_time = item.expire_time === null ? '永久有效' : moment(item.expire_time).format('YYYY/MM/DD HH:mm');
  });
  return shareFiles;
  
}

//格式化文件列表
export const formatFileList = (fileList, sortType) => {
  //添加辅助参数
  fileList.map(item => {
    item.checked = false;
    item.update = moment(item.update_time).format('YYYY/MM/DD HH:mm');
    item.icon = item.type === 1 ? "folder" : typeToIconType(item.suffix);
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
export const linkDownload = (file_id) => {
  axios.post('/api/disk/download', {
    file_id: file_id
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