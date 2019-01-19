import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';
import { history } from '../history';
import { entrance } from './entrance';
import { identity } from './identity';
import { loadingCount } from './loadingCount';
import { modal } from './modal';

export const reducers = combineReducers({
  modal,
  loadingCount,
  identity,
  entrance,
  router: connectRouter(history)
});
