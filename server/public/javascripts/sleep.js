// function sleep(num){
//   return new Promise((res,rej)=>{
//     setTimeout(res,num*1000);
//   })
// }
//
// sleep(5).then(()=>{
//   console.log('hello');
// })
let arr = [1,2,4,4,3,3,1,5,3];

function duplicates(arr) {
  let newArr = [];
  arr.sort();
  let temp = arr[0];
  let num=1;
  for(let i=1;i<arr.length;i++){
    if(temp==arr[i]){
      num++;
    }else{
      if(num>1){
        newArr.push(temp);
      }
      temp = arr[i];
      num = 1;
    }
  }
  return newArr;
}

console.log(duplicates(arr));

function log2(){
   let a='(app)';
   for(let i=0;i<arguments.length;i++){
     a+=' '+arguments[i];
   }
   console.log(a);
}
