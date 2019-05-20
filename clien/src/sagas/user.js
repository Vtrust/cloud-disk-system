import { put, take, call } from 'redux-saga/effects';
import { get, post } from '../fetch/fetch';
import { actionsTypes as UserActionTypes } from '../reducers/user';
import { message } from 'antd';
import history from "../util/history";


//登陆
export function* login(username, password) {
  yield put({ type: UserActionTypes.FETCH_START });
  try {
    return yield call(post, '/users/login', { username, password })
  } catch (error) {
    yield put({ type: UserActionTypes.SET_MESSAGE, msgContent: '用户名或密码错误', msgType: 0 });
  } finally {
    yield put({ type: UserActionTypes.FETCH_END });
  }
}

export function* loginFlow() {
  while (true) {
    let request = yield take(UserActionTypes.USER_LOGIN);
    let response = yield call(login, request.username, request.password);
    if (response && response.code === 0) {
      yield put({ type: UserActionTypes.SET_MESSAGE, msgContent: '登录成功!', msgType: 1 });
      yield put({ type: UserActionTypes.RESPONSE_USER_INFO, data: response.data })
    }
  }
}

//登出
export function* logout() {
  yield put({ type: UserActionTypes.FETCH_START });
  try {
    return yield call(get, '/users/logout')
  } catch (error) {
    //TODO
  } finally {
    yield put({ type: UserActionTypes.FETCH_END });
  }
}

export function* logoutFlow() {
  while (true) {
    let request = yield take(UserActionTypes.USER_LOGOUT);
    let response = yield call(logout);
    if (response && response.code === 0) {
      yield put({ type: UserActionTypes.SET_MESSAGE, msgContent: '登出成功!', msgType: 1 });
      yield put({ type: UserActionTypes.RESPONSE_USER_INFO, data: {} })
    }
  }
}

//注册
export function* register(username, password, email, phone) {
  //TODO
  try {
    return yield call(post, '/users/register', { username, password, email, phone });
  } catch (error) {
    //TODO
  } finally {
    //TODO
  }
}

export function* registerFlow() {
  while (true) {
    let request = yield take(UserActionTypes.USER_REGISTER);
    let response = yield call(register, request.username, request.password, request.email, request.phone);
    if (response && response.code === 0) {
      yield put({ type: UserActionTypes.RESPONSE_USER_INFO, data: response.data });
      setTimeout(() => {
        history.replace('/disk/root');
      }, 500);
    }
  }
}

//鉴权
export function* user_auth() {
  while (true) {
    yield take(UserActionTypes.USER_AUTH);
    try {
      yield put({ type: UserActionTypes.FETCH_START });
      let response = yield call(get, '/users/userInfo');
      if (response && response.code === 0) {
        yield put({ type: UserActionTypes.RESPONSE_USER_INFO, data: response.data })
      }
    } catch (err) {
      console.log(err);
    } finally {
      yield put({ type: UserActionTypes.FETCH_END });
    }
  }
}