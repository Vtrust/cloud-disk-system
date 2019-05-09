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

//原型链
function superType(){
    this.superValue = true;
}
superType.prototype.getsupervalue = function(){
    return this.superValue;
}
function subType(){
    this.subvalue = false;
}
subType.prototype = new superType();
let sub1 = new subType();
alert(sub1.getsupervalue());
//借用构造函数
function superType(){
  this.color=["red","blue","green"];
}
function subType(){
  superType.call(this);
}
let instance1 = new subType();
let instance2 = new subType();
instance1.color.push('black');
alert(instance1.color);//red,blue,green,black
alert(instance2.color);//red,blue,green
//组合继承
function superType(name){
  this.name = name;
  this.color = ["red","blue","green"];
}
superType.prototype.sayName = function(){
  alert(this.name);
}
function subType(name,age){
  superType.call(this,name);
  this.age = age;
}
subType.prototype = new superType();
subType.prototype.sayAge = function(){
  alert(this.age);
}

let instance1 = new subType("nick",18);
instance1.color.push('black');
alert(instance1.color);
instance1.sayName();
instance1.sayAge();

let instance2 = new subType("jack",20);
alert(instance2.color);
instance2.sayName();
instance2.sayAge();

//闭包
function createFunction(){
  var result = new Array();
  for(var i=0;i<10;i++){
    result[i]=function(){
      return i;
    }
  }
  return result;
}
// 匿名函数解决只有一个活动对象的问题
function createFunction(){
  var result = new Array();
  for(var i=0;i<10;i++){
    result[i]=function(num){
      return function(){
        return num;
      };
    }(i);
  }
  return result;
}
//this对象
var name = "The Window";
var object = {
  name:"My Object",
  getNameFunc:function(){
    return function(){
      return this.name;
    }
  }
}

alert(object.getNameFunc()()); //"The Window"
//解决方法
//this对象
var name = "The Window";
var object = {
  name:"My Object",
  getNameFunc:function(){
    var that = this;
    return function(){
      return that.name;
    }
  }
}

alert(object.getNameFunc()()); //"My Object"


function Parent(age) {
  this.age = age;
  this.sayAge=function(){
  console.log(this.age);
  }
}
Parent.prototype.sayParent = function() {
  alert("this is parentmethod!!!");
}

function Child(age){
  Parent.call(this,age);
}

Child.prototype = new Parent();
let instance1 = new Child(18);
instance1.sayAge();
instance1.sayParent();
//寄生式继承
function object(o){
  function F(){};
  F.prototype = o;
  return new F();
}

function createAnother(original){
  var clone = object(original);
  clone.sayHi = function(){
    alert('hi');
  }
  return clone;
}
var person = {
  name:"nick",
  friends:["shelby","court","van"]
}
var anotherPerson = createAnother(person);
anotherPerson.sayHi();
console.log(person);

//寄生组合式
function object(o){
  function F(){};
  F.prototype = o;
  return new F();
}
function inheritPrototype(subType,superType){
  var prototype = object(superType.prototype);
  prototype.constructor = subType;
  subType.prototype = prototype;
}
function superType(name){
  this.name = name;
}
superType.prototype.sayName = function(){
  alert(this.name);
}
function subType(name,age){
  superType.call(this,name);
  this.age = age;
}
inheritPrototype(subType,superType);
subType.prototype.sayAge = function(){
  alert(this.age);
}

var instance1 = new subType('jack',18);
instance1.sayName();
instance1.sayAge();

//bind函数
Function.prototype.mybind=function(){
  let self = this;
  let context = Array.prototype.shift.call(arguments);//保存要绑定额上下文
  let arg = Array.prototype.slice.call(arguments);//保存参数
  return function(){
    self.apply(context,arg.concat(Array.prototype.slice.call(arguments)));
  }
}
var value = 4321;
var a = {
  value:1234,
  getValue:function(arg1){
    alert(arg1);
    alert(this.value);
    console.log(arguments);
  }
}

a.getValue(1111,2222);
let af = a.getValue;
af();
let afb = af.mybind(a,1111);
afb(2222);
let afc = af.mybind(a);
afc(1111,2222);
