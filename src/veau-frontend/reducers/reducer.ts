import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import {modal} from './modal';
import {loadingCount} from './loadingCount';
import {identity} from './identity';
import {entrance} from './entrance';
import {history} from '../history';

export const reducers = combineReducers({
  modal,
  loadingCount,
  identity,
  entrance,
  router: connectRouter(history)
});
