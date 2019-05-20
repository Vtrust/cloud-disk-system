import { put, take, call } from 'redux-saga/effects'
import { get, post } from '../fetch/fetch'
import moment from "moment";
import { actionsTypes as FilesActionTypes } from '../reducers/files'
import { message } from 'antd';
import { typeToIconType } from '../util/files'

//获取目录下的所有文件
export function* getFileListFlow() {
  while (true) {
    let req = yield take(FilesActionTypes.GET_FILE_LIST);
    try {
      console.log('getFileListFlow', req);
      let res = yield call(get, `/disk/getFiles?userId=${req.userId}&folderId=${req.folderId}`);
      if (res && res.code === 0) {
        //数据格式化
        let data = res.data;
        data.list.map(item => {
          item.checked = false;
          item.update = moment(item.update_time).format('YYYY/MM/DD h:mm');
          item.type = typeToIconType(item.type);
        })
        let folder = data.list.filter(item=>{
          return item.type === 'folder';
        })
        let files = data.list.filter(item=>{
          return item.type !== 'folder';
        })
        data.list = folder.concat(files);
       // console.log(res.data, '22222222222');

        yield put({ type: FilesActionTypes.RESPONSE_FILE_LIST, data: res.data });
      }
    } catch (error) {
      console.log(error);
    }
  }
}