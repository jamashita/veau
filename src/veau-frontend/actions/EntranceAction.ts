import { AccountName } from '../../veau-vo/AccountName';
import { EntranceInformation } from '../../veau-vo/EntranceInformation';
import { Password } from '../../veau-vo/Password';
import {
  ACTION,
  EntranceAccountNameTypedAction,
  EntrancePasswordTypedAction,
  EntranceUpdateAction,
  IdentityAuthenticateAction
} from './Action';

export const accountTyped: (account: AccountName) => EntranceAccountNameTypedAction = (account: AccountName): EntranceAccountNameTypedAction => {
  return {
    type: ACTION.ENTRANCE_ACCOUNT_NAME_TYPED,
    account
  };
};

export const passwordTyped: (password: Password) => EntrancePasswordTypedAction = (password: Password): EntrancePasswordTypedAction => {
  return {
    type: ACTION.ENTRANCE_PASSWORD_TYPED,
    password
  };
};

export const updateEntranceInformation: (entranceInformation: EntranceInformation) => EntranceUpdateAction = (entranceInformation: EntranceInformation): EntranceUpdateAction => {
  return {
    type: ACTION.ENTRANCE_UPDATE,
    entranceInformation
  };
};

export const attemptLogin: () => IdentityAuthenticateAction = (): IdentityAuthenticateAction => {
  return {
    type: ACTION.IDENTITY_AUTHENTICATE
  };
};
