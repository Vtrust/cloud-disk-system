const crypto = require('crypto');

module.exports = {
  MD5_SUFFIX:'dsadqwe123214314354089*Z(&X()&dx8675a78sd6y8q796)',
  md5:function(pwd){
    let md5 = crypto.createHash('md5');
    return md5.update(pwd).digest('hex');
  },
  responseClient(res,httpCode = 500, code = 3,message='服务端异常',data={}) {
        let responseData = {};
        responseData.code = code;//状态码
        responseData.message = message;//消息
        responseData.data = data;//数据
        res.status(httpCode).json(responseData)
  }
}
