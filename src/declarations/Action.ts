import {Action as ReduxAction} from 'redux';
import {IdentityJSON} from './State';

export enum ACTION {
  LOCATION_CHANGE = '@@router/LOCATION_CHANGE',

  MODAL_RAISE = 'MODAL_RAISE',
  MODAL_CLOSE = 'MODAL_CLOSE',

  LOADING_START = 'LOADING_START',
  LOADING_FINISH = 'LOADING_FINISH',

  IDENTITY_AUTHENTICATE = 'IDENTITY_AUTHENTICATE',
  IDENTITY_LOCALE_MODIFIED = 'IDENTITY_LOCALE_MODIFIED',
  IDENTITY_IDENTIFIED = 'IDENTITY_IDENTIFIED',

  DESTROY_SESSION = 'DESTROY_SESSION'
}

export interface LocationChangeAction extends ReduxAction {
  type: ACTION.LOCATION_CHANGE;
  payload: {
    pathname: string;
    search: string;
    hash: string;
    state: any;
    key: string;
  }
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
export interface IdentityLocaleModifiedAction extends ReduxAction {
  type: ACTION.IDENTITY_LOCALE_MODIFIED;
  locale: string;
}
export interface IdentityIdentifiedAction extends ReduxAction {
  type: ACTION.IDENTITY_IDENTIFIED;
  props: IdentityJSON;
}
export interface DestroySessionAction extends ReduxAction {
  type: ACTION.DESTROY_SESSION;
}

export type Action =
    LocationChangeAction
  | ModalRaiseAction
  | ModalCloseAction
  | LoadingStartAction
  | LoadingFinishAction
  | IdentityAuthenticateAction
  | IdentityLocaleModifiedAction
  | IdentityIdentifiedAction
  | DestroySessionAction
  ;
