import { ACTION, Action } from '../actions/Action';
import { LocaleAJAXQuery } from '../queries/LocaleAJAXQuery';

const initialState: LocaleAJAXQuery = LocaleAJAXQuery.getInstance(
  [
  ],
  [
  ]
);

export const localeQuery: (state: LocaleAJAXQuery, action: Action) => LocaleAJAXQuery = (state: LocaleAJAXQuery = initialState, action: Action): LocaleAJAXQuery => {
  switch (action.type) {
    case ACTION.LOCALE_DEFINED: {
      return action.localeQuery;
    }
    default: {
      return state;
    }
  }
};
