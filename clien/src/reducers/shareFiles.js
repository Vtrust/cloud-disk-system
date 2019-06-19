const initialState = {
  shareInfo: {},
  list: [],
  otherShare:{},
};

export const actionsTypes = {
  SHARE_FILE: "SHARE_FILE",
  RESPONSE_SHARE_FILE: "RESPONSE_SHARE_FILE",
  GET_SAHRE_FILES: "GET_SAHRE_FILES",
  RESPONSE_GET_SHARE_FILES: "RESPONSE_GET_SHARE_FILES",
  DELETE_SHARE: "DELETE_SHARE",
  RESPONSE_DELETE_SHARE: "RESPONSE_DELETE_SHARE",
  GET_OTHER_SAHRE:"GET_OTHER_SAHRE",
  RESPONSE_GET_OTHER_SAHRE:"RESPONSE_GET_OTHER_SAHRE",
}

export const actions = {
  share_file: (file_id, duration, security) => ({
    type: actionsTypes.SHARE_FILE,
    file_id,
    duration,
    security
  }),
  get_share_files: () => ({
    type: actionsTypes.GET_SAHRE_FILES
  }),
  delete_share: (share_id) => ({
    type: actionsTypes.DELETE_SHARE,
    share_id
  }),
  get_other_share:(share_id,token)=>({
    type:actionsTypes.GET_OTHER_SAHRE,
    share_id,
    token
  })
}

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actionsTypes.RESPONSE_SHARE_FILE: {
      return { ...state, shareInfo: action.data }
    }
    case actionsTypes.RESPONSE_GET_SHARE_FILES: {
      return { ...state, list: action.data }
    }
    case actionsTypes.RESPONSE_DELETE_SHARE: {
      return {
        ...state, list: state.list.filter(item => {
          return item.share_id !== action.data;
        })
      }
    }
    case actionsTypes.RESPONSE_GET_OTHER_SAHRE:{
      return {
        ...state,otherShare:action.data
      }
    }
    default:
      return state
  }
}