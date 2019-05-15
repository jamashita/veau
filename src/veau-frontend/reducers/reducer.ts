import { connectRouter } from 'connected-react-router';
import { combineReducers, Reducer } from 'redux';
import { history } from '../history';
import { State } from '../State';
import { entranceInformation } from './entranceInformation';
import { identity } from './identity';
import { loadingCount } from './loadingCount';
import { locale } from './locale';
import { modal } from './modal';
import { notification } from './notification';
import { pageProvider } from './pageProvider';
import { stats } from './stats';
import { statsEdit } from './statsEdit';
import { statsItem } from './statsItem';
import { statsList } from './statsList';
import { statsOutlines } from './statsOutlines';

export const reducers: Reducer<State> = combineReducers({
  entranceInformation,
  identity,
  loadingCount,
  locale,
  modal,
  notification,
  pageProvider,
  stats,
  statsEdit,
  statsItem,
  statsList,
  statsOutlines,
  router: connectRouter(history)
});
