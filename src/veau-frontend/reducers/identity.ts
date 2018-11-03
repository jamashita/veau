import {Identity} from '../../declarations/State';
import {ACTION, Action} from '../../declarations/Action';

const initialState: Identity = {
  id: 0,
  language: '',
  name: ''
};

export const identity = (state: Identity = initialState, action: Action): Identity => {
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
    default: {
      return state;
    }
  }
};
