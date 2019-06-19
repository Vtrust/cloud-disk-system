import { formatFileList } from '../util/files'
const initialState = {
  checkeNum: 0,//选择文件数
  checked: false,//有文件选择
  path: "",//文件路径
  paths: [],//文件路径目录
  list: []//所有
};

export const actionsTypes = {
  GET_FILE_LIST: "GET_FILE_LIST",
  DELETE_FILES: "DELETE_FILES",
  RESPONSE_DELETE_FILES: "RESPONSE_DELETE_FILES",
  SELECT_FILE: 'SELECT_FILE',
  SELECT_ALL_FILE: 'SELECT_ALL_FILE',
  UNSELECT_ALL_FILE: 'UNSELECT_ALL_FILE',
  RENAME_FILE: "RENAME_FILE",
  RESPONSE_RENAME_FILE:"RESPONSE_RENAME_FILE",
  SHARE_FILE: "SHARE_FILE",
  SEARCH_FILES: "SEARCH_FILES",
  CREATE_FOLDER: "CREATE_FOLDER",
  RESPONSE_FILE_LIST: "RESPONSE_FILE_LIST",
  ADD_FILE: "ADD_FILE",
  SAME_TYPE_FILE: "SAME_TYPE_FILE"
}

export const actions = {
  get_file_list: (userId, folderId) => ({
    type: actionsTypes.GET_FILE_LIST,
    userId,
    folderId
  }),
  search_files: (keyword) => ({
    type: actionsTypes.SEARCH_FILES,
    keyword
  }),
  rename_file: (file_id, file_name) => ({
    type: actionsTypes.RENAME_FILE,
    file_id,
    file_name
  }),
  get_type_files: (file_type) => ({
    type: actionsTypes.SAME_TYPE_FILE,
    file_type
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
  delete_files: (file_id_list) => ({
    type: actionsTypes.DELETE_FILES,
    file_id_list
  }),
  create_folder: (file_name, path) => ({
    type: actionsTypes.CREATE_FOLDER,
    file_name,
    path
  }),
  add_file: (newFile) => ({
    type: actionsTypes.ADD_FILE,
    newFile
  })
}

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actionsTypes.RESPONSE_RENAME_FILE:{
      return {...state,list:state.list.map(item=>{
        if(item.file_id===action.data.file_id){
          return {...item,file_name:action.data.file_name}
        }else{
          return item;
        }
      })}
    }
    case actionsTypes.RESPONSE_DELETE_FILES: {
      let list = state.list.filter(item1 => {
        for (let i = 0; i < action.data.length; i++) {
          if (action.data[i].file_id === item1.file_id) return false;
        }
        return true;
      })
      return { ...state, list: list }
    }
    case actionsTypes.ADD_FILE: {
      let list = formatFileList([action.data, ...state.list]);
      return { ...state, list: list }
    }
    case actionsTypes.SELECT_FILE: {
      return {
        ...state, list: state.list.map((item) => {
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
        ...state, list: state.list.map((item) => {
          return { ...item, checked: true }
        })
      }
    }
    case actionsTypes.UNSELECT_ALL_FILE: {
      return {
        ...state, list: state.list.map((item) => {
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
