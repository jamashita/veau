import { LocaleQuery } from '../../veau-query/LocaleQuery';
import { ACTION, Action } from '../actions/Action';

const initialState: LocaleQuery = LocaleQuery.getInstance(
  [
  ],
  [
  ]
);

export const localeQuery: (state: LocaleQuery, action: Action) => LocaleQuery = (state: LocaleQuery = initialState, action: Action): LocaleQuery => {
  switch (action.type) {
    case ACTION.LOCALE_DEFINED: {
      return action.localeQuery;
    }
    default: {
      return state;
    }
  }
};
