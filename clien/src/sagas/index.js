import { fork } from 'redux-saga/effects';
import { loginFlow, logoutFlow, registerFlow, user_auth } from './user';
import { getFileListFlow, createFolderFlow, deleteFilesFlow, getSameFilesFlow, getFolderListFolw, searchFilesFlow, renameFileFlow } from "./files";
import { shareFilesFolw, getShareFilesFolw, deleteShareFolw ,getShareFilesDetailFolw} from './shareFiles';
export default function* rootSaga() {
  yield fork(loginFlow);
  yield fork(registerFlow);
  yield fork(user_auth);
  yield fork(logoutFlow);
  yield fork(getFileListFlow);
  yield fork(createFolderFlow);
  yield fork(deleteFilesFlow);
  yield fork(getSameFilesFlow);
  yield fork(getFolderListFolw);
  yield fork(searchFilesFlow);
  yield fork(renameFileFlow);

  //分享文件
  yield fork(shareFilesFolw);
  yield fork(getShareFilesFolw);
  yield fork(deleteShareFolw);
  yield fork(getShareFilesDetailFolw);
}