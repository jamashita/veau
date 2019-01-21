import { RouterState } from 'connected-react-router';
import { Action as ReduxAction } from 'redux';
import { StatsOverview } from '../veau-entity/StatsOverview';
import { Identity } from '../veau-vo/Identity';
import { Language } from '../veau-vo/Language';
import { Login } from '../veau-vo/Login';
import { Region } from '../veau-vo/Region';

export enum ACTION {
  LOCATION_CHANGE = '@@router/LOCATION_CHANGE',

  MODAL_RAISE = 'MODAL_RAISE',
  MODAL_CLOSE = 'MODAL_CLOSE',

  LOADING_START = 'LOADING_START',
  LOADING_FINISH = 'LOADING_FINISH',

  IDENTITY_AUTHENTICATE = 'IDENTITY_AUTHENTICATE',
  IDENTITY_RENEWED = 'IDENTITY_NEW_IDENTITY',
  IDENTITY_INITIALIZE = 'IDENTITY_INITIALIZE',
  IDENTITY_IDENTIFIED = 'IDENTITY_IDENTIFIED',

  LOGOUT = 'LOGOUT',

  PUSH_TO_STATS_LIST = 'PUSH_TO_STATS_LIST',
  PUSH_TO_ENTRANCE = 'PUSH_TO_ENTRANCE',

  ENTRANCE_ACCOUNT_NAME_TYPED = 'ENTRANCE_ACCOUNT_NAME_TYPED',
  ENTRANCE_PASSWORD_TYPED = 'ENTRANCE_PASSWORD_TYPED',
  ENTRANCE_LOGIN_INFO_UPDATE = 'ENTRANCE_LOGIN_INFO_UPDATE',

  OPEN_PROVIDER = 'OPEN_PROVIDER',
  CLOSE_PROVIDER = 'CLOSE_PROVIDER',

  LOCALE_DEFINED = 'LOCALE_DEFINED',

  STATS_OVERVIEW_UPDATE = 'STATS_OVERVIEW_UPDATE'
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
export interface LoadingStartAction extends ReduxAction {
  type: ACTION.LOADING_START;
}
export interface LoadingFinishAction extends ReduxAction {
  type: ACTION.LOADING_FINISH;
}
export interface IdentityAuthenticateAction extends ReduxAction {
  type: ACTION.IDENTITY_AUTHENTICATE;
}
export interface IdentityRenewAction extends ReduxAction {
  type: ACTION.IDENTITY_RENEWED;
  identity: Identity;
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
export interface PushToEntranceAction extends ReduxAction {
  type: ACTION.PUSH_TO_ENTRANCE;
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
  type: ACTION.ENTRANCE_LOGIN_INFO_UPDATE;
  login: Login;
}
export interface OpenProviderAction extends ReduxAction {
  type: ACTION.OPEN_PROVIDER;
}
export interface CloseProviderAction extends ReduxAction {
  type: ACTION.CLOSE_PROVIDER;
}
export interface LocaleDefinedAction extends ReduxAction {
  type: ACTION.LOCALE_DEFINED;
  languages: Array<Language>;
  regions: Array<Region>;
}
export interface StatsOverviewUpdateAction extends ReduxAction {
  type: ACTION.STATS_OVERVIEW_UPDATE;
  statsOverviews: Array<StatsOverview>;
}

export type Action =
    LocationChangeAction
  | ModalRaiseAction
  | ModalCloseAction
  | LoadingStartAction
  | LoadingFinishAction
  | IdentityAuthenticateAction
  | IdentityRenewAction
  | IdentityInitializeAction
  | IdentityIdentifiedAction
  | LogoutAction
  | PushToStatsListAction
  | PushToEntranceAction
  | EntranceAccountNameTypedAction
  | EntrancePasswordTypedAction
  | EntranceInfoUpdateAction
  | OpenProviderAction
  | CloseProviderAction
  | LocaleDefinedAction
  | StatsOverviewUpdateAction
  ;
