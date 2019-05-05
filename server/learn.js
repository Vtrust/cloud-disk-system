// let express = require('express');
// let app = express();
// let myLogger = function(req,res,next){
//   console.log('LOGGED');
//   next();
// }
//
// app.use(myLogger);
//
// app.get('/',function(req,res){
//   res.send('Hello World!');
// })
//
// app.listen(3000);
function sleep(time){
  time = time||0;
  time = time*1000;
  let now = +new Date();
  let timer = null;
  return new Promise((res,rej)=>{
    timer = setInterval(()=>{
      if(now+time<+new Date()){
        clearInterval(timer);
        res(true,false);
      }
    })
  });
}

console.log('sleep');
sleep(3).then((err,data)=>{
  console.log(err,data);
})
