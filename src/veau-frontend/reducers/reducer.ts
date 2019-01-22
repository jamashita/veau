import { connectRouter } from 'connected-react-router';
import { combineReducers, Reducer } from 'redux';
import { State } from '../../declarations/State';
import { history } from '../history';
import { entranceInformation } from './entranceInformation';
import { identity } from './identity';
import { loadingCount } from './loadingCount';
import { localeRepository } from './localeRepository';
import { modal } from './modal';
import { pageProvider } from './pageProvider';
import { stats } from './stats';
import { statsList } from './statsList';
import { statsOverviews } from './statsOverviews';

export const reducers: Reducer<State> = combineReducers({
  entranceInformation,
  identity,
  loadingCount,
  localeRepository,
  modal,
  pageProvider,
  stats,
  statsList,
  statsOverviews,
  router: connectRouter(history)
});
