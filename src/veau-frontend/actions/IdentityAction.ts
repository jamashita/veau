import {
  ACTION,
  IdentityInitializeAction,
  IdentityRenewAction
} from '../../declarations/Action';
import { Identity } from '../../veau-vo/Identity';

export const identityRenewed: (identity: Identity) => IdentityRenewAction = (identity: Identity): IdentityRenewAction => {
  return {
    type: ACTION.IDENTITY_RENEWED,
    identity
  };
};

export const initializeIdentity: () => IdentityInitializeAction = (): IdentityInitializeAction => {
  return {
    type: ACTION.IDENTITY_INITIALIZE
  };
};
