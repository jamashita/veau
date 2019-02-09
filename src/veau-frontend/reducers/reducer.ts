import { connectRouter } from 'connected-react-router';
import { combineReducers, Reducer } from 'redux';
import { State } from '../declarations/State';
import { history } from '../history';
import { entranceInformation } from './entranceInformation';
import { identity } from './identity';
import { loadingCount } from './loadingCount';
import { localeRepository } from './localeRepository';
import { modal } from './modal';
import { notification } from './notification';
import { pageProvider } from './pageProvider';
import { stats } from './stats';
import { statsEdit } from './statsEdit';
import { statsItem } from './statsItem';
import { statsList } from './statsList';
import { statsOverviews } from './statsOverviews';

export const reducers: Reducer<State> = combineReducers({
  entranceInformation,
  identity,
  loadingCount,
  localeRepository,
  modal,
  notification,
  pageProvider,
  stats,
  statsEdit,
  statsItem,
  statsList,
  statsOverviews,
  router: connectRouter(history)
});
