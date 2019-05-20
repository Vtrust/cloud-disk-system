const initialState = {
  isFetching: true,
  msg: {
    type: 1,//0失败 1成功
    content: ''
  },
  userInfo: {}
};

export const actionsTypes = {
  FETCH_START: "FETCH_START",
  FETCH_END: "FETCH_END",
  USER_LOGIN: "USER_LOGIN",
  USER_LOGOUT: "USER_LOGOUT",
  USER_REGISTER: "USER_REGISTER",
  RESPONSE_USER_INFO: "RESPONSE_USER_INFO",
  SET_MESSAGE: "SET_MESSAGE",
  USER_AUTH: "USER_AUTH"
}

export const actions = {
  post_login: (username, password) => ({
    type: actionsTypes.USER_LOGIN,
    username,
    password
  }),
  get_logout: () => ({
    type: actionsTypes.USER_LOGOUT
  }),
  post_register: (username, password, email, phone) => ({
    type: actionsTypes.USER_REGISTER,
    username,
    password,
    email,
    phone
  }),
  user_auth: function () {
    return {
      type: actionsTypes.USER_AUTH
    }
  }
}

export function reducer(state = initialState, action) {
  //console.log(action.type, action.data);

  switch (action.type) {
    case actionsTypes.FETCH_START:
      return {
        ...state, isFetching: true
      };
    case actionsTypes.FETCH_END:
      return {
        ...state, isFetching: false
      };
    case actionsTypes.SET_MESSAGE:
      return {
        ...state,
        isFetching: false,
        msg: {
          type: action.msgType,
          content: action.msgContent
        }
      };
    case actionsTypes.RESPONSE_USER_INFO:
      return {
        ...state, userInfo: action.data
      };
    default:
      return state
  }
}