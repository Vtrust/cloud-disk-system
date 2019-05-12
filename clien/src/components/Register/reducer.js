import {REGISTER_FETCH_STARTED, REGISTER_FETCH_SUCCESS, REGISTER_FETCH_FAILURE} from './actionTypes';
import * as Status from './status.js';
const initialState ={
  nickname:'',
  gender:'',
  email:'',
  phone:''
}
export default (state=initialState, action) => {
  switch(action.type) {
    case REGISTER_FETCH_STARTED: {
      return {...state,status: Status.LOADING,...action.userinfo};
    }
    case REGISTER_FETCH_SUCCESS: {
      return{...state,status: Status.SUCCESS};
    }
    case REGISTER_FETCH_FAILURE: {
      return {status: Status.FAILURE};
    }
    default: {
      return state;
    }
  }
}
