// function register(){
//   alert('hello');
//   // let xmlHttp = new XMLHttpRequest();
//   // function CommentAll(){
//   //   xmlHttp.onreadystatechange = callback1;
//   //   xmlHttp.open('post',)
//   // }
//
// window.onload = function
// document.getElementById('button').onclick=function(){
//   alert('hello');
// }

function fun1(){
  var xmlhttp;
  if(window.XMLHttpRequest){
    xmlhttp = new XMLHttpRequest();
  }else{
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange = function(){
    if(xmlhttp.readyState==4 && xmlhttp.status==200){
      console.log(xmlhttp.responseText);
    }
  }
  //xmlhttp.open("GET","http://localhost:3000/users/info",true);

  // xmlhttp.open("POST","http://localhost:3000/users/login",true);
  // xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	// xmlhttp.send("userName=Tony2&password=12345");

  xmlhttp.open("GET","http://localhost:3000/users/userInfo",true);
  xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
  xmlhttp.send();

  // xmlhttp.open("GET","http://localhost:3000/users/logout",true);
  // xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
  // xmlhttp.send();
}
