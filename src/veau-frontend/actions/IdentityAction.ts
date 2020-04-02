import { VeauAccount } from '../../veau-vo/VeauAccount';
import { ACTION, IdentityAuthenticatedAction, IdentityIdentifiedAction, IdentityInitializeAction } from './Action';

export const identityAuthenticated: (identity: VeauAccount) => IdentityAuthenticatedAction = (identity: VeauAccount) => {
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
