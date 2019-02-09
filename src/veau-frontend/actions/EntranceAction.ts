import {
  ACTION,
  EntranceAccountNameTypedAction,
  EntranceInfoUpdateAction,
  EntrancePasswordTypedAction, IdentityAuthenticateAction
} from '../declarations/Action';
import { EntranceInformation } from '../../veau-vo/EntranceInformation';

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

export const entranceInformationUpdate: (entranceInformation: EntranceInformation) => EntranceInfoUpdateAction = (entranceInformation: EntranceInformation): EntranceInfoUpdateAction => {
  return {
    type: ACTION.ENTRANCE_INFO_UPDATE,
    entranceInformation
  };
};

export const attemptLogin: () => IdentityAuthenticateAction = (): IdentityAuthenticateAction => {
  return {
    type: ACTION.IDENTITY_AUTHENTICATE
  };
};
