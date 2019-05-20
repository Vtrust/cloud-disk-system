const initialState = {
  checked: false,//有文件选择
  path:"",//文件路径
  paths: [],//文件路径目录
  list: []//所有
};

export const actionsTypes = {
  GET_FILE_LIST: "GET_FILE_LIST",
  DELETE_FILES: "DELETE_FILES",
  SELECT_FILE: 'SELECT_FILE',
  SELECT_ALL_FILE: 'SELECT_ALL_FILE',
  UNSELECT_ALL_FILE: 'UNSELECT_ALL_FILE',
  RENAME_FILE: "RENAME_FILE",
  SHARE_FILE: "SHARE_FILE",
  CREATE_FOLDER: "CREATE_FOLDER",
  RESPONSE_FILE_LIST: "RESPONSE_FILE_LIST"
}

export const actions = {
  get_file_list: (userId, folderId) => ({
    type: actionsTypes.GET_FILE_LIST,
    userId,
    folderId
  }),
  select_file: (file_id, checked) => ({
    type: actionsTypes.SELECT_FILE,
    file_id,
    checked
  }),
  select_all_file: () => ({
    type: actionsTypes.SELECT_ALL_FILE
  }),
  unselect_all_file: () => ({
    type: actionsTypes.UNSELECT_ALL_FILE
  }),
  post_delete_files: (file_id_list) => ({
    type: actionsTypes.UNDELETE_FILES,
    file_id_list
  }),
  post_create_folder: (file_name) => ({
    type: actionsTypes.CREATE_FOLDER,
    file_name,
  })
}

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actionsTypes.SELECT_FILE: {
      return {
        ...state, checked: action.checked, list: state.list.map((item) => {
          if (item.file_id === action.file_id) {
            return { ...item, checked: !item.checked }
          } else {
            return item;
          }
        })
      }
    }
    case actionsTypes.SELECT_ALL_FILE: {
      return {
        ...state, checked: true, list: state.list.map((item) => {
          return { ...item, checked: true }
        })
      }
    }
    case actionsTypes.UNSELECT_ALL_FILE: {
      return {
        ...state, checked: false, list: state.list.map((item) => {
          return { ...item, checked: false }
        })
      }
    }
    case actionsTypes.RESPONSE_FILE_LIST:
      return {
        ...state, ...action.data
      };
    default:
      return state;
  }
}
