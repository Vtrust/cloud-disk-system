import { combineReducers } from 'redux';
import { reducer as userReducer } from './user';
import { reducer as filesReducer } from './files';
import { reducer as uploadFilesReducer } from './uploadFiles';
import { reducer as moveFilesReducer } from './moveFiles';
import { reducer as shareFilesReducer } from './shareFiles';

export default combineReducers({
  user: userReducer,
  files: filesReducer,
  uploadFiles: uploadFilesReducer,
  moveFiles: moveFilesReducer,
  shareFiles: shareFilesReducer,
});