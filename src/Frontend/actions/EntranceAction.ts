import { AccountName } from '../../VO/AccountName';
import { EntranceInformation } from '../../VO/EntranceInformation';
import { Password } from '../../VO/Password';
import {
  ACTION,
  EntranceAccountNameTypedAction,
  EntrancePasswordTypedAction,
  EntranceUpdateAction,
  IdentityAuthenticateAction
} from './Action';

export const accountTyped = (account: AccountName): EntranceAccountNameTypedAction => {
  return {
    type: ACTION.ENTRANCE_ACCOUNT_NAME_TYPED,
    account
  };
};

export const passwordTyped = (password: Password): EntrancePasswordTypedAction => {
  return {
    type: ACTION.ENTRANCE_PASSWORD_TYPED,
    password
  };
};

export const updateEntranceInformation = (entranceInformation: EntranceInformation): EntranceUpdateAction => {
  return {
    type: ACTION.ENTRANCE_UPDATE,
    entranceInformation
  };
};

export const attemptLogin: () => IdentityAuthenticateAction = () => {
  return {
    type: ACTION.IDENTITY_AUTHENTICATE
  };
};
