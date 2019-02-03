import { RouterState } from 'connected-react-router';
import { Action as ReduxAction } from 'redux';
import { Stats } from '../veau-entity/Stats';
import { StatsItem } from '../veau-entity/StatsItem';
import { StatsOverview } from '../veau-entity/StatsOverview';
import { VeauAccount } from '../veau-entity/VeauAccount';
import { Term } from '../veau-enum/Term';
import { LocaleRepository } from '../veau-repository/LocaleRepository';
import { EntranceInformation } from '../veau-vo/EntranceInformation';
import { ISO3166 } from '../veau-vo/ISO3166';
import { ISO639 } from '../veau-vo/ISO639';
import { Language } from '../veau-vo/Language';
import { Region } from '../veau-vo/Region';
import { StatsID } from '../veau-vo/StatsID';

export enum ACTION {
  LOCATION_CHANGE = '@@router/LOCATION_CHANGE',

  MODAL_RAISE = 'MODAL_RAISE',
  MODAL_CLOSE = 'MODAL_CLOSE',

  NOTIFICATION_APPEAR = 'NOTIFICATION_APPEAR',
  NOTIFICATION_DISAPPEAR = 'NOTIFICATION_DISAPPEAR',

  LOADING_START = 'LOADING_START',
  LOADING_FINISH = 'LOADING_FINISH',

  IDENTITY_AUTHENTICATE = 'IDENTITY_AUTHENTICATE',
  IDENTITY_AUTHENTICATED = 'IDENTITY_AUTHENTICATED',
  IDENTITY_INITIALIZE = 'IDENTITY_INITIALIZE',
  IDENTITY_IDENTIFIED = 'IDENTITY_IDENTIFIED',

  LOGOUT = 'LOGOUT',

  PUSH_TO_STATS_LIST = 'PUSH_TO_STATS_LIST',
  PUSH_TO_STATS_EDIT = 'PUSH_TO_STATS_EDIT',
  PUSH_TO_ENTRANCE = 'PUSH_TO_ENTRANCE',

  OPEN_PROVIDER = 'OPEN_PROVIDER',
  CLOSE_PROVIDER = 'CLOSE_PROVIDER',

  LOCALE_DEFINED = 'LOCALE_DEFINED',

  ENTRANCE_ACCOUNT_NAME_TYPED = 'ENTRANCE_ACCOUNT_NAME_TYPED',
  ENTRANCE_PASSWORD_TYPED = 'ENTRANCE_PASSWORD_TYPED',
  ENTRANCE_INFO_UPDATE = 'ENTRANCE_LOGIN_INFO_UPDATE',

  STATS_LIST_NEW_STATS = 'STATS_LIST_NEW_STATS',
  STATS_LIST_CLOSE_STATS_MODAL = 'STATS_LIST_CLOSE_STATS_MODAL',
  STATS_LIST_NEW_STATS_UPDATE = 'STATS_LIST_NEW_STATS_UPDATE',
  STATS_LIST_NAME_TYPED = 'STATS_LIST_NAME_TYPED',
  STATS_LIST_ISO639_SELECTED = 'STATS_LIST_ISO639_SELECTED',
  STAts_LIST_ISO3166_SELECTED = 'STAts_LIST_ISO3166_SELECTED',
  STATS_LIST_TERM_SELECTED = 'STATS_LIST_TERM_SELECTED',
  STATS_LIST_RENEW_STATS = 'STATS_LIST_RENEW_STATS',
  STATS_LIST_SAVE_NEW_STATS = 'STATS_LIST_SAVE_NEW_STATS',
  STATS_LIST_RESET_NEW_STATS = 'STATS_LIST_RESET_NEW_STATS',

  STATS_EDIT_NAME_TYPED = 'STATS_EDIT_NAME_TYPED',
  STATS_EDIT_LANGUAGE_SELECTED = 'STATS_EDIT_LANGUAGE_SELECTED',
  STATS_EDIT_REGION_SELECTED = 'STATS_EDIT_REGION_SELECTED',
  STATS_EDIT_TERM_SELECTED = 'STATS_EDIT_TERM_SELECTED',
  STATS_EDIT_DATA_FILLED = 'STATS_EDIT_DATA_FILLED',
  STATS_EDIT_DATA_DELETED = 'STATS_EDIT_DATA_DELETED',
  STATS_EDIT_ITEM_NAME_TYPED = 'STATS_EDIT_ITEM_NAME_TYPED',
  STATS_EDIT_ITEM_UNIT_TYPED = 'STATS_EDIT_ITEM_UNIT_TYPED',
  STATS_EDIT_ITEM_SAVE = 'STATS_EDIT_ITEM_SAVE',
  STATS_EDIT_ROW_SELECTED = 'STATS_EDIT_ROW_SELECTED',
  STATS_EDIT_ITEM_SELECTING = 'STATS_EDIT_ITEM_SELECTING',
  STATS_EDIT_SELECTING_ITEM_NAME_TYPED = 'STATS_EDIT_SELECTING_ITEM_NAME_TYPED',
  STATS_EDIT_SELECTING_ITEM_UNIT_TYPED = 'STATS_EDIT_SELECTING_ITEM_UNIT_TYPED',
  STATS_EDIT_START_DATE_DETERMINED = 'STATS_EDIT_START_DATE_DETERMINED',
  STATS_EDIT_UPDATE_SELECTING_ITEM = 'STATS_EDIT_UPDATE_SELECTING_ITEM',
  STATS_EDIT_ROW_MOVED = 'STATS_EDIT_ROW_MOVED',
  STATS_EDIT_INVALID_VALUE_INPUT = 'STATS_EDIT_INVALID_VALUE_INPUT',
  STATS_EDIT_REMOVE_SELECTING_ITEM = 'STATS_EDIT_REMOVE_SELECTING_ITEM',
  STATS_EDIT_CLEAR_SELECTING_ITEM = 'STATS_EDIT_CLEAR_SELECTING_ITEM',
  STATS_EDIT_SAVE_STATS = 'STATS_EDIT_SAVE_STATS',

  STATS_OVERVIEW_UPDATE = 'STATS_OVERVIEW_UPDATE',
  STATS_OVERVIEW_RESET = 'STATS_OVERVIEW_RESET',
  STATS_UPDATE = 'STATS_UPDATE',
  STATS_RESET = 'STATS_RESET',
  STATS_ITEM_UPDATE = 'STATS_ITEM_UPDATE',
  STATS_ITEM_RESET = 'STATS_ITEM_RESET'
}

export interface LocationChangeAction extends ReduxAction {
  type: ACTION.LOCATION_CHANGE;
  payload: RouterState;
}
export interface ModalRaiseAction extends ReduxAction {
  type: ACTION.MODAL_RAISE;
  title: string;
  description: string;
  values?: {[key: string]: string};
}
export interface ModalCloseAction extends ReduxAction {
  type: ACTION.MODAL_CLOSE;
}
export interface NotificationAppearAction extends ReduxAction {
  type: ACTION.NOTIFICATION_APPEAR;
  kind: 'info' | 'success' | 'warn' | 'error';
  horizontal: 'left' | 'center' | 'right';
  vertical: 'top' | 'bottom';
  message: string;
  duration: number;
  values?: {[key: string]: string};
}
export interface NotificationDisappearAction extends ReduxAction {
  type: ACTION.NOTIFICATION_DISAPPEAR;
}
export interface LoadingStartAction extends ReduxAction {
  type: ACTION.LOADING_START;
}
export interface LoadingFinishAction extends ReduxAction {
  type: ACTION.LOADING_FINISH;
}
export interface IdentityAuthenticateAction extends ReduxAction {
  type: ACTION.IDENTITY_AUTHENTICATE;
}
export interface IdentityAuthenticatedAction extends ReduxAction {
  type: ACTION.IDENTITY_AUTHENTICATED;
  identity: VeauAccount;
}
export interface IdentityInitializeAction extends ReduxAction {
  type: ACTION.IDENTITY_INITIALIZE;
}
export interface IdentityIdentifiedAction extends ReduxAction {
  type: ACTION.IDENTITY_IDENTIFIED;
}
export interface LogoutAction extends ReduxAction {
  type: ACTION.LOGOUT;
}
export interface PushToStatsListAction extends ReduxAction {
  type: ACTION.PUSH_TO_STATS_LIST;
}
export interface PushToStatsEditAction extends ReduxAction {
  type: ACTION.PUSH_TO_STATS_EDIT;
  statsID: StatsID;
}
export interface PushToEntranceAction extends ReduxAction {
  type: ACTION.PUSH_TO_ENTRANCE;
}
export interface OpenProviderAction extends ReduxAction {
  type: ACTION.OPEN_PROVIDER;
}
export interface CloseProviderAction extends ReduxAction {
  type: ACTION.CLOSE_PROVIDER;
}
export interface LocaleDefinedAction extends ReduxAction {
  type: ACTION.LOCALE_DEFINED;
  localeRepository: LocaleRepository;
}
export interface EntranceAccountNameTypedAction extends ReduxAction {
  type: ACTION.ENTRANCE_ACCOUNT_NAME_TYPED;
  account: string;
}
export interface EntrancePasswordTypedAction extends ReduxAction {
  type: ACTION.ENTRANCE_PASSWORD_TYPED;
  password: string;
}
export interface EntranceInfoUpdateAction extends ReduxAction {
  type: ACTION.ENTRANCE_INFO_UPDATE;
  entranceInformation: EntranceInformation;
}
export interface StatsListNewStatsAction extends ReduxAction {
  type: ACTION.STATS_LIST_NEW_STATS;
}
export interface StatsListCloseNewStatsModalAction extends ReduxAction {
  type: ACTION.STATS_LIST_CLOSE_STATS_MODAL;
}
export interface StatsListNewStatsUpdateAction extends ReduxAction {
  type: ACTION.STATS_LIST_NEW_STATS_UPDATE;
  statsOverview: StatsOverview;
}
export interface StatsListNameTypedAction extends ReduxAction {
  type: ACTION.STATS_LIST_NAME_TYPED;
  name: string;
}
export interface StatsListISO639SelectedAction extends ReduxAction {
  type: ACTION.STATS_LIST_ISO639_SELECTED;
  iso639: ISO639;
}
export interface StatsListISO3166SelectedAction extends ReduxAction {
  type: ACTION.STAts_LIST_ISO3166_SELECTED;
  iso3166: ISO3166;
}
export interface StatsListTermSelectedAction extends ReduxAction {
  type: ACTION.STATS_LIST_TERM_SELECTED;
  term: Term;
}
export interface StatsListRenewStatsAction extends ReduxAction {
  type: ACTION.STATS_LIST_RENEW_STATS;
  newStatsOverview: StatsOverview;
}
export interface StatsListSaveNewStatsAction extends ReduxAction {
  type: ACTION.STATS_LIST_SAVE_NEW_STATS;
}
export interface StatsListResetNewStatsAction extends ReduxAction {
  type: ACTION.STATS_LIST_RESET_NEW_STATS;
}
export interface StatsEditNameTypedAction extends ReduxAction {
  type: ACTION.STATS_EDIT_NAME_TYPED;
  name: string;
}
export interface StatsEditLanguageSelectedAction extends ReduxAction {
  type: ACTION.STATS_EDIT_LANGUAGE_SELECTED;
  language: Language;
}
export interface StatsEditRegionSelectedAction extends ReduxAction {
  type: ACTION.STATS_EDIT_REGION_SELECTED;
  region: Region;
}
export interface StatsEditTermSelectedActoin extends ReduxAction {
  type: ACTION.STATS_EDIT_TERM_SELECTED;
  term: Term;
}
export interface StatsEditDataFilledAction extends ReduxAction {
  type: ACTION.STATS_EDIT_DATA_FILLED;
  row: number;
  column: number;
  value: number;
}
export interface StatsEditDataDeletedAction extends ReduxAction {
  type: ACTION.STATS_EDIT_DATA_DELETED;
  row: number;
  column: number;
}
export interface StatsEditItemNameTypedAction extends ReduxAction {
  type: ACTION.STATS_EDIT_ITEM_NAME_TYPED;
  name: string;
}
export interface StatsEditItemUnitTypedAction extends ReduxAction {
  type: ACTION.STATS_EDIT_ITEM_UNIT_TYPED;
  unit: string;
}
export interface StatsEditItemSaveAction extends ReduxAction {
  type: ACTION.STATS_EDIT_ITEM_SAVE;
}
export interface StatsEditRowSelectedAction extends ReduxAction {
  type: ACTION.STATS_EDIT_ROW_SELECTED;
  row: number;
}
export interface StatsEditItemSelectingAction extends ReduxAction {
  type: ACTION.STATS_EDIT_ITEM_SELECTING;
  statsItem: StatsItem;
  row: number;
}
export interface StatsEditSelectingItemNameTypedAction extends ReduxAction {
  type: ACTION.STATS_EDIT_SELECTING_ITEM_NAME_TYPED;
  name: string;
}
export interface StatsEditSelectingItemUnitTypedAction extends ReduxAction {
  type: ACTION.STATS_EDIT_SELECTING_ITEM_UNIT_TYPED;
  unit: string;
}
export interface StatsEditStartDateDeterminedAction extends ReduxAction {
  type: ACTION.STATS_EDIT_START_DATE_DETERMINED;
  startDate: string;
}
export interface StatsEditUpdateSelectingItemAction extends ReduxAction {
  type: ACTION.STATS_EDIT_UPDATE_SELECTING_ITEM;
  statsItem: StatsItem;
}
export interface StatsEditRowMovedAction extends ReduxAction {
  type: ACTION.STATS_EDIT_ROW_MOVED;
  column: number;
  target: number;
}
export interface StatsEditInvalidValueInputAction extends ReduxAction {
  type: ACTION.STATS_EDIT_INVALID_VALUE_INPUT;
}
export interface StatsEditRemoveSelectingItemAction extends ReduxAction {
  type: ACTION.STATS_EDIT_REMOVE_SELECTING_ITEM;
  statsItem: StatsItem;
}
export interface StatsEditClearSelectingItemAction extends ReduxAction {
  type: ACTION.STATS_EDIT_CLEAR_SELECTING_ITEM;
}
export interface StatsEditSaveStatsAction extends ReduxAction {
  type: ACTION.STATS_EDIT_SAVE_STATS;
}
export interface StatsOverviewUpdateAction extends ReduxAction {
  type: ACTION.STATS_OVERVIEW_UPDATE;
  statsOverviews: Array<StatsOverview>;
}
export interface StatsOverviewResetAction extends ReduxAction {
  type: ACTION.STATS_OVERVIEW_RESET;
}
export interface StatsUpdateAction extends ReduxAction {
  type: ACTION.STATS_UPDATE;
  stats: Stats;
}
export interface StatsResetAction extends ReduxAction {
  type: ACTION.STATS_RESET;
}
export interface StatsItemUpdateAction extends ReduxAction {
  type: ACTION.STATS_ITEM_UPDATE;
  statsItem: StatsItem;
}
export interface StatsItemResetAction extends ReduxAction {
  type: ACTION.STATS_ITEM_RESET;
}

export type Action =
    LocationChangeAction
  | ModalRaiseAction
  | ModalCloseAction
  | NotificationAppearAction
  | NotificationDisappearAction
  | LoadingStartAction
  | LoadingFinishAction
  | IdentityAuthenticateAction
  | IdentityAuthenticatedAction
  | IdentityInitializeAction
  | IdentityIdentifiedAction
  | LogoutAction
  | PushToStatsListAction
  | PushToStatsEditAction
  | PushToEntranceAction
  | OpenProviderAction
  | CloseProviderAction
  | LocaleDefinedAction
  | EntranceAccountNameTypedAction
  | EntrancePasswordTypedAction
  | EntranceInfoUpdateAction
  | StatsListNewStatsAction
  | StatsListCloseNewStatsModalAction
  | StatsListNewStatsUpdateAction
  | StatsListNameTypedAction
  | StatsListISO639SelectedAction
  | StatsListISO3166SelectedAction
  | StatsListTermSelectedAction
  | StatsListRenewStatsAction
  | StatsListSaveNewStatsAction
  | StatsListResetNewStatsAction
  | StatsEditNameTypedAction
  | StatsEditLanguageSelectedAction
  | StatsEditRegionSelectedAction
  | StatsEditTermSelectedActoin
  | StatsEditDataFilledAction
  | StatsEditDataDeletedAction
  | StatsEditItemNameTypedAction
  | StatsEditItemUnitTypedAction
  | StatsEditItemSaveAction
  | StatsEditRowSelectedAction
  | StatsEditItemSelectingAction
  | StatsEditSelectingItemNameTypedAction
  | StatsEditSelectingItemUnitTypedAction
  | StatsEditStartDateDeterminedAction
  | StatsEditUpdateSelectingItemAction
  | StatsEditRowMovedAction
  | StatsEditInvalidValueInputAction
  | StatsEditRemoveSelectingItemAction
  | StatsEditClearSelectingItemAction
  | StatsEditSaveStatsAction
  | StatsOverviewUpdateAction
  | StatsOverviewResetAction
  | StatsUpdateAction
  | StatsResetAction
  | StatsItemUpdateAction
  | StatsItemResetAction
  ;
