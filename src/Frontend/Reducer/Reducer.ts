import { connectRouter, RouterState } from 'connected-react-router';
import { combineReducers, Reducer } from 'redux';

import { VeauAction } from '../Action';
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
import { statsListItems } from './StatsListItems';

export const reducers: Reducer<State, VeauAction> = combineReducers<State, VeauAction>({
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
  statsListItems,
  router: connectRouter(history) as Reducer<RouterState, VeauAction>
});
