import {
  ACTION,
  IdentityIdentifiedAction,
  IdentityInitializeAction,
  IdentityLanguageModifiedAction
} from '../../declarations/Action';
import { Identity } from '../reducers/identity';

export const identified: (identity: Identity) => IdentityIdentifiedAction = (identity: Identity): IdentityIdentifiedAction => {
  return {
    type: ACTION.IDENTITY_IDENTIFIED,
    identity
  };
};

export const newLanguageSelected: (language: string) => IdentityLanguageModifiedAction = (language: string): IdentityLanguageModifiedAction => {
  return {
    type: ACTION.IDENTITY_LANGUAGE_MODIFIED,
    language
  };
};

export const initializeItentity: () => IdentityInitializeAction = (): IdentityInitializeAction => {
  return {
    type: ACTION.IDENTITY_INITIALIZE,
  };
};
