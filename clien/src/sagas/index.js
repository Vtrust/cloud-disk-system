import {fork} from 'redux-saga/effects';
import {loginFlow, logoutFlow, registerFlow, user_auth} from './user';
import { getFileListFlow } from "./files";
export default function* rootSaga() {
  yield fork(loginFlow);
  yield fork(registerFlow);
  yield fork(user_auth);
  yield fork(logoutFlow);
  yield fork(getFileListFlow);
}