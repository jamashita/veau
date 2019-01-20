import { ACTION, Action } from '../../declarations/Action';
import { VeauAccountJSON } from '../../veau-entity/VeauAccount';

export type Identity = VeauAccountJSON;

const initialState: Identity = {
  id: 0,
  account: '',
  language: '',
  locale: ''
};

export const identity: (state: Identity, action: Action) => Identity = (state: Identity = initialState, action: Action): Identity => {
  switch (action.type) {
    case ACTION.IDENTITY_LANGUAGE_MODIFIED: {
      return {
        ...state,
        language: action.language
      };
    }
    case ACTION.IDENTITY_IDENTIFIED: {
      return action.identity;
    }
    case ACTION.IDENTITY_INITIALIZE: {
      const {
        language,
        locale
      } = action;

      return {...initialState, language, locale};
    }
    default: {
      return state;
    }
  }
};
