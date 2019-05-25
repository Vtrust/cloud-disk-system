import { put, take, call } from 'redux-saga/effects'
import { get, post } from '../fetch/fetch'
import moment from "moment";
import { actionsTypes as FilesActionTypes } from '../reducers/files'
import { message } from 'antd';
import {formatFileList } from '../util/files'


//获取目录下的所有文件
export function* getFileListFlow() {
  while (true) {
    let req = yield take(FilesActionTypes.GET_FILE_LIST);
    try {
      console.log('getFileListFlow', req);
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

//创建新的文件夹
export function* createFolderFlow() {
  while (true) {
    let req = yield take(FilesActionTypes.CREATE_FOLDER);
    try {
      let { file_name, path } = req;
      let res = yield call(post, `/disk/newFolder`, { file_name, path })
      if (res && res.code === 0) {
        console.log(res);

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
      console.log('saga',file_id_list.length,req);
      file_id_list=JSON.stringify(file_id_list)
      console.log('saga',file_id_list);
      
      let res = yield call(post, `/disk/deleteFiles`, { file_id_list })
      if (res && res.code === 0) {
        console.log(res);

        yield put({type:FilesActionTypes.RESPONSE_DELETE_FILES,data:list})
      }
    } catch (error) {
      console.log(error);

    }
  }
}