import { Identity } from '../../domain/VO/Identity/Identity';
import {
  IDENTITY_AUTHENTICATED,
  IDENTITY_AUTHENTICATION_FAILED,
  IDENTITY_IDENTIFIED,
  IDENTITY_INITIALIZE,
  IdentityAuthenticatedAction,
  IdentityAuthenticationFailedAction,
  IdentityIdentifiedAction,
  IdentityInitializeAction
} from '../Action';

export const identityAuthenticated = (identity: Identity): IdentityAuthenticatedAction => {
  return {
    type: IDENTITY_AUTHENTICATED,
    identity
  };
};

export const identityAuthenticationFailed = (): IdentityAuthenticationFailedAction => {
  return {
    type: IDENTITY_AUTHENTICATION_FAILED
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
