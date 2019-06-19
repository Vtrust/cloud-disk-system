import { put, take, call } from 'redux-saga/effects';
import { get, post } from '../fetch/fetch';
import { actionsTypes as FilesActionTypes } from '../reducers/files';
import {actionsTypes as MoveFilesActionTypes} from '../reducers/moveFiles'
import { message } from 'antd';
import {formatFileList } from '../util/files'


//获取目录下的所有文件夹
export function* getFolderListFolw(){
  while(true){
    let req = yield take(MoveFilesActionTypes.GET_FOLDER_LIST);
    try {
      let res = yield call(get,`/disk/getFolders?folder_id=${req.folder_id}`);
      if(res&&res.code === 0){
        yield put({type:MoveFilesActionTypes.RESPONSE_FOLDER_LIST,data:res.data});
      }
    } catch (error) {
      console.log(error);
    }
  }
}

//获取目录下的所有文件
export function* getFileListFlow() {
  while (true) {
    let req = yield take(FilesActionTypes.GET_FILE_LIST);
    try {
      let res = yield call(get, `/disk/getFiles?userId=${req.userId}&folderId=${req.folderId}`);
      if (res && res.code === 0) {
        res.data.list = formatFileList(res.data.list);
        yield put({ type: FilesActionTypes.RESPONSE_FILE_LIST, data: res.data });
      }else{
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

//查找文件
export function* searchFilesFlow(){
  while(true){
    let req = yield take(FilesActionTypes.SEARCH_FILES);
    try {
      let {keyword} = req;
      let res = yield call(post,`/disk/searchFiles`,{keyword});
      if(res&&res.code === 0){
        res.data.list = formatFileList(res.data.list);
        yield put({ type: FilesActionTypes.RESPONSE_FILE_LIST, data: res.data });
      }
    } catch (error) {
      console.log(error);
    }
  }
}


//获取同类型文件
export function* getSameFilesFlow(){
  while(true){
    let req = yield take(FilesActionTypes.SAME_TYPE_FILE);
    try {
      let res = yield call(get,`/disk/typeFiles?type=${req.file_type}`);
      if(res&&res.code === 0){
        res.data.list = formatFileList(res.data.list);
        yield put({ type: FilesActionTypes.RESPONSE_FILE_LIST, data: res.data });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

//文件重命名
export function* renameFileFlow(){
  while(true){
    let req = yield take(FilesActionTypes.RENAME_FILE);
    try {
      console.log(req);
      let{file_id,file_name} = req;
      let res = yield call(post,`/disk/renameFile`,{file_id,file_name});
      if(res&&res.code === 0){
        yield put({ type: FilesActionTypes.RESPONSE_RENAME_FILE, data: {file_id,file_name}});
      }
    } catch (error) {
      console.log(error);
    }
  }
}

//创建新的文件夹
export function* createFolderFlow() {
  while (true) {
    let req = yield take(FilesActionTypes.CREATE_FOLDER);
    try {
      let { file_name, path } = req;
      let res = yield call(post, `/disk/newFolder`, { file_name, path })
      if (res && res.code === 0) {
        yield put({type:FilesActionTypes.ADD_FILE,data:res.data.newFile})
      }
    } catch (error) {
      console.log(error);
    }
  }
}

//删除文件
export function* deleteFilesFlow() {
  while (true) {
    let req = yield take(FilesActionTypes.DELETE_FILES);
    try {
      let { file_id_list } = req;
      let list = file_id_list;
      file_id_list=JSON.stringify(file_id_list)
      let res = yield call(post, `/disk/deleteFiles`, { file_id_list })
      if (res && res.code === 0) {
        yield put({type:FilesActionTypes.RESPONSE_DELETE_FILES,data:list})
      }
    } catch (error) {
      console.log(error);
    }
  }
}