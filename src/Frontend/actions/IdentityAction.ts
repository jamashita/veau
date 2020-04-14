import { VeauAccount } from '../../VO/VeauAccount';
import { ACTION, IdentityAuthenticatedAction, IdentityIdentifiedAction, IdentityInitializeAction } from './Action';

export const identityAuthenticated = (identity: VeauAccount): IdentityAuthenticatedAction => {
  return {
    type: ACTION.IDENTITY_AUTHENTICATED,
    identity
  };
};

export const initializeIdentity: () => IdentityInitializeAction = () => {
  return {
    type: ACTION.IDENTITY_INITIALIZE
  };
};

export const identified: () => IdentityIdentifiedAction = () => {
  return {
    type: ACTION.IDENTITY_IDENTIFIED
  };
};
