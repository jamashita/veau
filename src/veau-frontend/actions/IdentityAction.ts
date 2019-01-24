import {
  ACTION, IdentityAuthenticatedAction,
  IdentityIdentifiedAction, IdentityInitializeAction
} from '../../declarations/Action';
import { Identity } from '../../veau-vo/Identity';

export const identityAuthenticated: (identity: Identity) => IdentityAuthenticatedAction = (identity: Identity): IdentityAuthenticatedAction => {
  return {
    type: ACTION.IDENTITY_AUTHENTICATED,
    identity
  };
};

export const initializeIdentity: () => IdentityInitializeAction = (): IdentityInitializeAction => {
  return {
    type: ACTION.IDENTITY_INITIALIZE
  };
};

export const identified: () => IdentityIdentifiedAction = (): IdentityIdentifiedAction => {
  return {
    type: ACTION.IDENTITY_IDENTIFIED
  };
};
