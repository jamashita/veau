import { connectRouter } from 'connected-react-router';
import { combineReducers, Reducer } from 'redux';
import { history } from '../history';
import { State } from '../State';
import { entranceInformation } from './entranceInformation';
import { identity } from './identity';
import { loadingCount } from './loadingCount';
import { localeQuery } from './localeQuery';
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
  localeQuery,
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
