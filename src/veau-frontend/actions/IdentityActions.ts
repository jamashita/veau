import {Identity} from '../../declarations/State';
import {
  ACTION,
  IdentityIdentifiedAction,
  IdentityLanguageModifiedAction
} from '../../declarations/Action';

export const identified = (identity: Identity): IdentityIdentifiedAction => {
  return {
    type: ACTION.IDENTITY_IDENTIFIED,
    identity
  };
};

export const newLanguageSelected = (language: string): IdentityLanguageModifiedAction => {
  return {
    type: ACTION.IDENTITY_LANGUAGE_MODIFIED,
    language
  };
};
