// 查找当前目录下所有文件
exports.getRootFile = (user_id)=>{
  return `(select *
          from own_file
          where user_id=${user_id}
          and folder_id is null
          and type = 'folder'
          order by update_time desc)
          union
          (select *
          from own_file
          where user_id=${user_id}
          and folder_id is null
          and type != 'folder'
          order by update_time desc)`;
}

//查找当前目录下的所有文件
exports.getFolderFile = (folder_id)=>{
  return  `(select *
          from own_file
          where folder_id = ${folder_id}
          and type = 'folder'
          order by update_time desc)
          union
          (select *
          from own_file
          where folder_id = ${folder_id}
          and type != 'folder'
          order by update_time desc)`;
}

//查询用户信息
exports.getUserInfoById = (user_id)=>{
  return `select * from user where user_id = '${user_id}'`;
}
exports.getUserInfoByName = (user_name)=>{
  return `select * from user where user_name = '${user_name}'`;
}
exports.getUserInfoByNameAndPwd = (user_name,user_password)=>{
  return `select * from user where user_name = '${user_name}' and user_password='${user_password}'`;
}

//新增用户
exports.insertUser = ()=>{
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
