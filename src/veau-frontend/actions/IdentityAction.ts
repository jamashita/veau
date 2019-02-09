import {
  ACTION, IdentityAuthenticatedAction,
  IdentityIdentifiedAction, IdentityInitializeAction
} from './Action';
import { VeauAccount } from '../../veau-entity/VeauAccount';

export const identityAuthenticated: (identity: VeauAccount) => IdentityAuthenticatedAction = (identity: VeauAccount): IdentityAuthenticatedAction => {
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
