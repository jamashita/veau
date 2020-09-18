import { Reducer } from 'redux';
import { Locale } from '../../VO/Locale/Locale';
import { LOCALE_DEFINED, VeauAction } from '../Action';

const initialState: Locale = Locale.empty();

export const locale: Reducer<Locale, VeauAction> = (
  state: Locale = initialState,
  action: VeauAction
) => {
  switch (action.type) {
    case LOCALE_DEFINED: {
      return action.locale;
    }
    default: {
      return state;
    }
  }
};
