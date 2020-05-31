import { Reducer } from 'redux';

import { Locale } from '../../VO/Locale/Locale';
import { Action, LOCALE_DEFINED } from '../Action/Action';

// TODO UNNECESSARY
const initialState: Locale = Locale.empty();

export const locale: Reducer<Locale, Action> = (state: Locale = initialState, action: Action) => {
  switch (action.type) {
    case LOCALE_DEFINED: {
      return action.locale;
    }
    default: {
      return state;
    }
  }
};
