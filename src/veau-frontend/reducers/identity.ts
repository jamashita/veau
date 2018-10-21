import {IdentityJSON} from '../../declarations/State';
import {ACTION, Action} from '../../declarations/Action';

const initialState: IdentityJSON = {
  id: 0,
  language: '',
  locale: '',
  name: ''
};

export const identity = (state: IdentityJSON = initialState, action: Action): IdentityJSON => {
  switch (action.type) {
    case ACTION.IDENTITY_LOCALE_MODIFIED: {
      return {
        ...state, locale: action.locale
      };
    }
    case ACTION.IDENTITY_IDENTIFIED: {
      return action.props;
    }
    default: {
      return state;
    }
  }
};
