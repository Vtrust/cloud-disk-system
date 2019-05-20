const initialState = {
  list: [],//上传文件列表
};

export const actionsTypes = {
  ADD_UPLOAD_TASK: "ADD_UPLOAD_TASK",
  COMPLETE_TASK: "COMPLETE_TASK",
  UPDATE_TASK: "UPDATE_TASK",
  PAUSE_TASK: "PAUSE_TASK"
}

export const actions = {
  add_upload_task: (file) => ({
    type: actionsTypes.ADD_UPLOAD_TASK,
    file
  }),
  update_task: (uid, message, percent = 0) => ({
    type: actionsTypes.UPDATE_TASK,
    uid,
    message,
    percent
  }),
  complete_task: (uid) => ({
    type: actionsTypes.COMPLETE_TASK,
    uid
  })
}

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actionsTypes.ADD_UPLOAD_TASK: {
      return {
        ...state, list: [{
          uid: action.file.uid,
          name: action.file.name,
          uploadSize:0,
          size: action.file.size,
          message: "",
          percent: 0,
        }, ...state.list]
      }
    }
    case actionsTypes.UPDATE_TASK: {
      return {
        ...state, list: state.list.map((item) => {
          if (item.uid === action.uid) {
            return { ...item, message: action.message, percent: action.percent,uploadSize:Math.round((item.size* action.percent)/100)}
          } else {
            return item
          }
        })
      }
    }
    case actionsTypes.COMPLETE_TASK: {
      let list = state.list.filter((item) => {
        return item.uid!==action.uid
      });
      console.log("COMPLETE_TASK",list);
      
      return {
        ...state, list: list,
      }
    }
    default:
      return state;
  }
}
