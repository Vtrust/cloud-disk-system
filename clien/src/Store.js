import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {reducer as registerReducer} from './components/Register'

const reducer = combineReducers({
  user:registerReducer,
})

const store = createStore(
  reducer,
  {},
  applyMiddleware(thunk)
);

export default store;
