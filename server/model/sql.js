// 查找根目录目录下所有文件
exports.getRootFile = (user_id) => {
  return `(select file_id,file_name,file.type,IFNULL(folder_id,'root') as folder_id, IFNULL(size,'-') as size,update_time
          from file LEFT JOIN real_file ON file.real_file_id=real_file.real_file_id
          where user_id= ${user_id}
          and folder_id is null
          order by update_time desc)`;
}

//查找当前目录下的所有文件
exports.getFolderFile = (folder_id, user_id) => {
  return `(select file_id,file_name,file.type,IFNULL(folder_id,'root') as folder_id, IFNULL(size,'-') as size,update_time
          from file LEFT JOIN real_file ON file.real_file_id=real_file.real_file_id
          where user_id = ${user_id}
          and folder_id = ${folder_id}
          order by update_time desc)`;
}

//查找某一文件的文件路径
exports.getPathByFileId = (file_id) => {
  return `select path from file where file_id=${file_id}`;
}
//查找路径的所有信息
exports.getPathInfoByPath = (path) =>{
  return `SELECT file_id,file_name FROM file WHERE FIND_IN_SET(file_id,'${path}')>0;`
}

//查询用户信息
exports.getUserInfoById = (user_id) => {
  return `select * from user where user_id = '${user_id}'`;
}
exports.getUserInfoByName = (user_name) => {
  return `select * from user where user_name = '${user_name}'`;
}
exports.getUserInfoByNameAndPwd = (user_name, user_password) => {
  return `select * from user where user_name = '${user_name}' and user_password='${user_password}'`;
}

//新增用户
exports.insertUser = () => {
  // let keys = [];
  // let values = [];
  // for(key in user){
  //   keys.push(key);
  //   values.push(user[key]);
  // }
  // key = key.join(',');
  // values = values.join(',');
  return `insert into user set ?`;
}
