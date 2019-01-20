import {
  ACTION,
  EntranceAccountNameTypedAction,
  EntranceInfoUpdateAction,
  EntrancePasswordTypedAction, IdentityAuthenticateAction
} from '../../declarations/Action';
import { Login } from '../../veau-vo/Login';

export const accountTyped: (account: string) => EntranceAccountNameTypedAction = (account: string): EntranceAccountNameTypedAction => {
  return {
    type: ACTION.ENTRANCE_ACCOUNT_NAME_TYPED,
    account
  };
};

export const passwordTyped: (password: string) => EntrancePasswordTypedAction = (password: string): EntrancePasswordTypedAction => {
  return {
    type: ACTION.ENTRANCE_PASSWORD_TYPED,
    password
  };
};

export const entranceLoginInfoUpdate: (login: Login) => EntranceInfoUpdateAction = (login: Login): EntranceInfoUpdateAction => {
  return {
    type: ACTION.ENTRANCE_LOGIN_INFO_UPDATE,
    login
  };
};

export const login: () => IdentityAuthenticateAction = (): IdentityAuthenticateAction => {
  return {
    type: ACTION.IDENTITY_AUTHENTICATE
  };
};
