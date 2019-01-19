import { RouterState } from 'connected-react-router';
import { Action as ReduxAction } from 'redux';
import { Identity } from '../veau-frontend/reducers/identity';
import { Login } from '../veau-vo/Login';

export enum ACTION {
  LOCATION_CHANGE = '@@router/LOCATION_CHANGE',

  MODAL_RAISE = 'MODAL_RAISE',
  MODAL_CLOSE = 'MODAL_CLOSE',

  LOADING_START = 'LOADING_START',
  LOADING_FINISH = 'LOADING_FINISH',

  IDENTITY_AUTHENTICATE = 'IDENTITY_AUTHENTICATE',
  IDENTITY_LANGUAGE_MODIFIED = 'IDENTITY_LANGUAGE_MODIFIED',
  IDENTITY_IDENTIFIED = 'IDENTITY_IDENTIFIED',

  DESTROY_SESSION = 'DESTROY_SESSION',

  PUSH_TO_HOME = 'PUSH_TO_HOME',

  ENTRANCE_ACCOUNT_NAME_TYPED = 'ENTRANCE_ACCOUNT_NAME_TYPED',
  ENTRANCE_PASSWORD_TYPED = 'ENTRANCE_PASSWORD_TYPED',
  ENTRANCE_LOGIN_INFO_UPDATE = 'ENTRANCE_LOGIN_INFO_UPDATE'
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
export interface IdentityLanguageModifiedAction extends ReduxAction {
  type: ACTION.IDENTITY_LANGUAGE_MODIFIED;
  language: string;
}
export interface IdentityIdentifiedAction extends ReduxAction {
  type: ACTION.IDENTITY_IDENTIFIED;
  identity: Identity;
}
export interface DestroySessionAction extends ReduxAction {
  type: ACTION.DESTROY_SESSION;
}
export interface PushToHomeAction extends ReduxAction {
  type: ACTION.PUSH_TO_HOME;
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

export type Action =
    LocationChangeAction
  | ModalRaiseAction
  | ModalCloseAction
  | LoadingStartAction
  | LoadingFinishAction
  | IdentityAuthenticateAction
  | IdentityLanguageModifiedAction
  | IdentityIdentifiedAction
  | DestroySessionAction
  | PushToHomeAction
  | EntranceAccountNameTypedAction
  | EntrancePasswordTypedAction
  | EntranceInfoUpdateAction
  ;
