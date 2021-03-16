import { connectRouter, RouterState } from 'connected-react-router';
import { combineReducers, Reducer } from 'redux';
import { VeauAction } from '../Action';
import { history } from '../History';
import { State } from '../State';
import { entranceInformation } from './EntranceInformation';
import { identity } from './Identity';
import { loadingCount } from './LoadingCount';
import { locale } from './Locale';
import { modal } from './Modal';
import { notification } from './Notification';
import { pageProvider } from './PageProvider';
import { statsEdit } from './StatsEdit';
import { statsList } from './StatsList';

export const reducers: Reducer<State, VeauAction> = combineReducers<State, VeauAction>({
  entranceInformation,
  identity,
  loadingCount,
  modal,
  notification,
  pageProvider,
  locale,
  statsEdit,
  statsList,
  router: connectRouter(history) as Reducer<RouterState, VeauAction>
});
