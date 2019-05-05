module.exports = {
  //服务器设置
  host:'localhost',
  port:'3001',
  session:{
    secret:'cloud_disk',
    key:'cloud_disk',
    maxAge:2592000000
  },
  //数据库设置
  dbHost:'localhost',
  dbPort:'3306',
  username:'root',
  password:'root',
  database:'cloud_disk'
}
