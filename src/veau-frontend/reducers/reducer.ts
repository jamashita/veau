import { connectRouter } from 'connected-react-router';
import { combineReducers, Reducer } from 'redux';
import { State } from '../../declarations/State';
import { history } from '../history';
import { entrance } from './entrance';
import { identity } from './identity';
import { loadingCount } from './loadingCount';
import { modal } from './modal';
import { pageProvider } from './pageProvider';

export const reducers: Reducer<State> = combineReducers({
  modal,
  loadingCount,
  identity,
  entrance,
  pageProvider,
  router: connectRouter(history)
});
