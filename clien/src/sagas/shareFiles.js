import { put, take, call } from 'redux-saga/effects';
import { get, post } from '../fetch/fetch';
import { actionsTypes as ShareFilesActionTypes } from '../reducers/shareFiles';
import { message } from 'antd';
import { formatShareFiles } from '../util/files'

//获取分享文件
export function* getShareFilesDetailFolw() {
  while (true) {
    let req = yield take(ShareFilesActionTypes.GET_OTHER_SAHRE);
    try {
      let { share_id, token } = req;
      let res = yield call(post, `/disk/shareDetail`, { share_id, token });
      if (res && res.code === 0) {
        console.log(res.data);
        res.data.share_id = share_id;
        if(res.data.type!==-1&&res.data.type!==-2){res.data.fileInfo = formatShareFiles([res.data.fileInfo])[0];}
        yield put({ type: ShareFilesActionTypes.RESPONSE_GET_OTHER_SAHRE, data: res.data });
       // message.success('创建分享成功！');
      }
    } catch (error) {
      console.log(error);
      //message.error('创建失败');
    }
  }
}

//分享文件
export function* shareFilesFolw() {
  while (true) {
    let req = yield take(ShareFilesActionTypes.SHARE_FILE);
    try {
      let { file_id, duration, security } = req;
      let res = yield call(post, `/disk/shareFiles`, { file_id, duration, security });
      if (res && res.code === 0) {
        yield put({ type: ShareFilesActionTypes.RESPONSE_SHARE_FILE, data: res.data });
        message.success('创建分享成功！');
      }
    } catch (error) {
      console.log(error);
      message.error('创建失败');
    }
  }
}

//获得所有分享的文件
export function* getShareFilesFolw() {
  while (true) {
    let req = yield take(ShareFilesActionTypes.GET_SAHRE_FILES);
    try {
      let res = yield call(get, `/disk/shareFiles`);
      if (res && res.code === 0) {
        res.data = formatShareFiles(res.data);
        yield put({ type: ShareFilesActionTypes.RESPONSE_GET_SHARE_FILES, data: res.data });
      }
    } catch (error) {
      console.log(error);
      message.error('网络错误 获取分享文件失败!');
    }
  }
}

//删除分享的文件
export function* deleteShareFolw() {
  while (true) {
    let req = yield take(ShareFilesActionTypes.DELETE_SHARE);
    try {
      let {share_id} = req
      let res = yield call(post, `/disk/deleteShares`,{share_id});
      if (res && res.code === 0) {
        yield put({ type: ShareFilesActionTypes.RESPONSE_DELETE_SHARE, data: share_id });
        message.success('删除成功！');
      }
    } catch (error) {
      console.log(error);
      message.error('网络错误 删除文件失败!');
    }
  }
}