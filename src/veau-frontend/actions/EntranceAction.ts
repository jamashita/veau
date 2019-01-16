import {
  ACTION, EntranceAccountNameTypedAction,
  EntranceInfoUpdateAction,
  EntrancePasswordTypedAction,
  IdentityAuthenticateAction
} from '../../declarations/Action';
import {Login} from '../../veau-vo/Login';

export const accountNameTyped = (name: string): EntranceAccountNameTypedAction => {
  return {
    type: ACTION.ENTRANCE_ACCOUNT_NAME_TYPED,
    name
  };
};

export const passwordTyped = (password: string): EntrancePasswordTypedAction => {
  return {
    type: ACTION.ENTRANCE_PASSWORD_TYPED,
    password
  };
};

export const entranceLoginInfoUpdate = (login: Login): EntranceInfoUpdateAction => {
  return {
    type: ACTION.ENTRANCE_LOGIN_INFO_UPDATE,
    login
  };
};

export const login = (): IdentityAuthenticateAction => {
  return {
    type: ACTION.IDENTITY_AUTHENTICATE,
  };
};
