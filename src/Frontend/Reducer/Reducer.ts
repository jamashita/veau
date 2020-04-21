import { connectRouter, RouterState } from 'connected-react-router';
import { combineReducers, Reducer } from 'redux';
import { Action } from '../Action/Action';
import { history } from '../history';
import { State } from '../State';
import { entranceInformation } from './EntranceInformation';
import { identity } from './Identity';
import { loadingCount } from './LoadingCount';
import { locale } from './Locale';
import { modal } from './Modal';
import { notification } from './Notification';
import { pageProvider } from './PageProvider';
import { stats } from './Stats';
import { statsEdit } from './StatsEdit';
import { statsItem } from './StatsItem';
import { statsList } from './StatsList';
import { statsOutlines } from './StatsOutlines';

export const reducers: Reducer<State, Action> = combineReducers<State, Action>({
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
  router: connectRouter(history) as Reducer<RouterState, Action>
});
