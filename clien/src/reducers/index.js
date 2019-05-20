import {combineReducers} from 'redux';
import {reducer as userReducer} from './user';
import {reducer as filesReducer} from './files';
import {reducer as uploadFilesReducer} from './uploadFiles';

export default combineReducers({
  user:userReducer,
  files:filesReducer,
  uploadFiles:uploadFilesReducer
});