export const typeToIconType = (type) =>{
  switch (type) {
    //文档
    case 'doc':
      return 'file-word';
    case 'folder':
      return 'folder';
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