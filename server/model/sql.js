//查找文件
exports.searchFile = (code)=>{

}

//查找类型文件
exports.getFilesByType = (typeList) =>{
  return  `select * from source_file where FIND_IN_SET(suffix,${typeList}) order by create_time desc`;
}

//查找文件存储名
exports.getSourceName = (file_id) =>{
  return `select source_name ,file_name
          from file join source_file on file.source_file_id = source_file.source_file_id
          where file_id=${file_id}`;
}

//删除某文夹下的所有文件
exports.deleteFileByFolderIdList = (folder_id_list) =>{
  let sql = `delete from file WHERE FIND_IN_SET(${folder_id_list[0]},path)>0`
  for(let i=1;i<folder_id_list.length;i++){
    sql+` or FIND_IN_SET(${folder_id_list[i]},path)>0`;
  }
  return sql;
}
//删除多个文件
exports.deleteFileByIdList = (file_id_list) =>{
  let  str = file_id_list.join(",");
  return `delete from file where file_id in (${str})`;
}

//通过用户ID、文件名、路径查找
exports.getFileByPathName = (user_id,file_name,path) => {
  return `select * from file where user_id=${user_id} and file_name='${file_name}' and path='${path}'`;
}
// 通过名称查找源文件
exports.getSourceFileByName = (source_name)=> {
  return `select * from source_file where source_name = '${source_name}'`;
}
// 源文件引用数加一
exports.increaseSourceFileCite = (source_file_id) => {
  return `update source_file SET cite=cite+1 WHERE source_file_id = ${source_file_id}`;
}
// 新增源文件
exports.insertSourceFile = () => {
  return `insert into source_file set ?`;
}

// 新增文件
exports.insertFile = () => {
  return `insert into file set ?`;
}

// 查找根目录目录下所有文件
exports.getRootFile = (user_id) => {
  return `(select file_id,file_name,type,IFNULL(source_file.suffix,'folder') as suffix,IFNULL(folder_id,'root') as folder_id, IFNULL(size,'-') as size,update_time
          from file LEFT JOIN source_file ON file.source_file_id=source_file.source_file_id
          where user_id= ${user_id}
          and folder_id is null
         )`;
}

//查找当前目录下的所有文件
exports.getFolderFile = (folder_id, user_id) => {
  return `(select file_id,file_name,type,IFNULL(source_file.suffix,'folder') as suffix,IFNULL(folder_id,'root') as folder_id, IFNULL(size,'-') as size,update_time
          from file LEFT JOIN source_file ON file.source_file_id=source_file.source_file_id
          where user_id= ${user_id}
          and folder_id = ${folder_id})`;
}

//查找某一文件的文件路径
exports.getPathByFileId = (file_id) => {
  return `select path from file where file_id=${file_id}`;
}
//查找路径的所有信息
exports.getPathInfoByPath = (path) => {
  return `SELECT file_id,file_name FROM file WHERE FIND_IN_SET(file_id,'${path}')>0;`
}

//查询用户信息
exports.getUserInfoById = (user_id) => {
  return `select * from user where user_id = '${user_id}'`;
}
exports.getUserInfoByName = (username) => {
  return `select * from user where username = '${username}'`;
}
exports.getUserInfoByNameAndPwd = (username, password) => {
  return `select * from user where username = '${username}' and password='${password}'`;
}

//新增用户
exports.insertUser = () => {
  return `insert into user set ?`;
}
