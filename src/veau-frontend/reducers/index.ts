import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {modal} from './modal';
import {loadingCount} from './loadingCount';
import {identity} from './identity';
import {entrance} from './entrance';

export const reducers = combineReducers({
  modal,
  loadingCount,
  identity,
  entrance,
  routing: routerReducer
});
