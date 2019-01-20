import {
  ACTION,
  IdentityInitializeAction,
  IdentityLanguageModifiedAction, IdentityRenewAction
} from '../../declarations/Action';
import {Identity} from '../../veau-vo/Identity';

export const newLanguageSelected: (language: string) => IdentityLanguageModifiedAction = (language: string): IdentityLanguageModifiedAction => {
  return {
    type: ACTION.IDENTITY_LANGUAGE_MODIFIED,
    language
  };
};

export const identityRenewed: (identity: Identity) => IdentityRenewAction = (identity: Identity): IdentityRenewAction => {
  return {
    type: ACTION.IDENTITY_RENEWED,
    identity
  };
};

export const initializeItentity: () => IdentityInitializeAction = (): IdentityInitializeAction => {
  return {
    type: ACTION.IDENTITY_INITIALIZE,
  };
};
