import { Reducer } from 'redux';
import { Locale } from '../../veau-entity/aggregate/Locale';
import { ACTION, Action } from '../actions/Action';

const initialState: Locale = Locale.default();

export const locale: Reducer<Locale, Action> = (state: Locale = initialState, action: Action): Locale => {
  switch (action.type) {
    case ACTION.LOCALE_DEFINED: {
      return action.locale;
    }
    default: {
      return state;
    }
  }
};
