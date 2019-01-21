import { connectRouter } from 'connected-react-router';
import { combineReducers, Reducer } from 'redux';
import { State } from '../../declarations/State';
import { history } from '../history';
import { entrance } from './entrance';
import { identity } from './identity';
import { loadingCount } from './loadingCount';
import { localeRepository } from './localeRepository';
import { modal } from './modal';
import { pageProvider } from './pageProvider';
import { statsOverviews } from './statsOverviews';

export const reducers: Reducer<State> = combineReducers({
  entrance,
  identity,
  loadingCount,
  localeRepository,
  modal,
  pageProvider,
  statsOverviews,
  router: connectRouter(history)
});
