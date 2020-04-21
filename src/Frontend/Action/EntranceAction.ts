import { AccountName } from '../../VO/AccountName';
import { EntranceInformation } from '../../VO/EntranceInformation';
import { Password } from '../../VO/Password';
import {
  ENTRANCE_ACCOUNT_NAME_TYPED,
  ENTRANCE_PASSWORD_TYPED,
  ENTRANCE_UPDATE,
  EntranceAccountNameTypedAction,
  EntrancePasswordTypedAction,
  EntranceUpdateAction,
  IDENTITY_AUTHENTICATE,
  IdentityAuthenticateAction
} from './Action';

export const accountTyped = (account: AccountName): EntranceAccountNameTypedAction => {
  return {
    type: ENTRANCE_ACCOUNT_NAME_TYPED,
    account
  };
};

export const passwordTyped = (password: Password): EntrancePasswordTypedAction => {
  return {
    type: ENTRANCE_PASSWORD_TYPED,
    password
  };
};

export const updateEntranceInformation = (entranceInformation: EntranceInformation): EntranceUpdateAction => {
  return {
    type: ENTRANCE_UPDATE,
    entranceInformation
  };
};

export const attemptLogin = (): IdentityAuthenticateAction => {
  return {
    type: IDENTITY_AUTHENTICATE
  };
};
