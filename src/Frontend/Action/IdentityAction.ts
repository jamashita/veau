import { Identity } from '../../VO/Identity/Identity';
import {
  IDENTITY_AUTHENTICATED,
  IDENTITY_IDENTIFIED,
  IDENTITY_INITIALIZE,
  IdentityAuthenticatedAction,
  IdentityIdentifiedAction,
  IdentityInitializeAction
} from '../Action';

export const identityAuthenticated = (identity: Identity): IdentityAuthenticatedAction => {
  return {
    type: IDENTITY_AUTHENTICATED,
    identity
  };
};

export const initializeIdentity = (): IdentityInitializeAction => {
  return {
    type: IDENTITY_INITIALIZE
  };
};

export const identified = (): IdentityIdentifiedAction => {
  return {
    type: IDENTITY_IDENTIFIED
  };
};
