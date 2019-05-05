const config = require('../config/default');
let mysql      = require('mysql');

//连接信息
const option = {
  host:config.dbHost,
  port:config.dbPort,
  user:config.username,
  password:config.password,
  database:config.database
};

// 建立连接池
const pool = mysql.createPool(option);

/**
 * select和delete操作
 * @param  {string}   sql      sql语句
 * @param  {Function} callback 回调函数
 * @return {none}
 * */
const __selsctDelete = (sql) => {
  return new Promise((res,rej)=>{
    pool.getConnection(function (err, conn) {
      if (err) {
        console.log('CONNECT ERROR:', err.message)
        rej(err);
      } else {
        conn.query(sql, function (err, rows, fields) {
          // 释放连接
          conn.release()
          // 事件驱动回调
          if(err) rej(err);
          if(rows&&rows.length==0) res(null);
          res(rows);
        })
      }
    })
  });
}
// const __selsctDelete = (sql, callback) => {
//   pool.getConnection(function (err, conn) {
//     if (err) {
//       console.log('CONNECT ERROR:', err.message)
//       callback(err, null, null)
//     } else {
//       conn.query(sql, function (err, rows, fields) {
//         // 释放连接
//         conn.release()
//         // 事件驱动回调
//         callback(err, rows, fields)
//       })
//     }
//   })
// }
/**
 * update和insert操作
 * @param  {string}   sql      sql语句
 * @param  {array}    params   参数数组
 * @param  {Function} callback 回调函数
 * @return {none}
 */
const __updateInsert = (sql, params) => {
  return new Promise((res,rej)=>{
    pool.getConnection(function (err, conn) {
      if (err) {
        console.log('CONNECT ERROR:', err.message)
        rej(err);
      } else {
        conn.query(sql, params, function (err, rows, fields) {
          // 释放连接
          conn.release()
          if(err) rej(err);
          if(rows&&rows.length==0) res(null);
          res(rows);
        })
      }
    })
  });
}
/**
 * query函数重载
 * @return {none}
 */
exports.query = function () {
  let length = arguments.length
  let sql = ''
  if (length === 1) {
    sql = arguments[0]
    console.log(sql);
    return __selsctDelete(sql)
  } else if (length === 2) {
    sql = arguments[0]
    let params = arguments[1]
    return __updateInsert(sql, params)
  } else {
    return new Promise((res,rej)=>{
        rej('参数填写错误');
    })
  }
}

// let connection = mysql.createConnection({
//   host:config.dbHost,
//   user:config.user,
//   password:config.password,
//   database:config.database
// })
// connection.connect()
//
// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
// });
//
// connection.end();
