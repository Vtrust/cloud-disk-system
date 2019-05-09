var obj = [
  {id:1,parent:null},
]
function change(obj){
  let obj2 = {};
  obj.forEach(tobj=>{//循环每个元素
    if(tobj.parent==null){//parent为null则为第一层
      obj2.obj={
        id:tobj.id,
        parent:null
      }
    }else{//找parent
      addChild(obj2.obj,tobj);
    }
  })
  return obj2;
}
function addChild(parent,child){
  if(parent.id==child.parent){//添加孩子
    parent.child={
      id:child.id,
      parent:child.parent
    }
  }else{
    if(parent.child!=null){//在孩子里面找父母
      addChild(parent.child,child);
    }else{
      return;//找不到psrent
    }
  }
}

const anyStr = str => {
  if(str.length <= 1){
    return [str];
  }else if(str.length >1){
    let temp = anyStr(str.slice(1));
    let result = [];
    temp.forEach(data=>{
      for(let i=0;i<=data.length;i++){
        console.log(data);
        let t = data.split('');
        t.splice(i,0,str[0])
        result.push(t.join(''));
      }
    })
    return result;
  }
}
