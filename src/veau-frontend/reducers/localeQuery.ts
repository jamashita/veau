import { LocaleMemoryQuery } from '../../veau-query/LocaleQuery';
import { ACTION, Action } from '../actions/Action';

const initialState: LocaleMemoryQuery = LocaleMemoryQuery.getInstance(
  [
  ],
  [
  ]
);

export const localeQuery: (state: LocaleMemoryQuery, action: Action) => LocaleMemoryQuery = (state: LocaleMemoryQuery = initialState, action: Action): LocaleMemoryQuery => {
  switch (action.type) {
    case ACTION.LOCALE_DEFINED: {
      return action.localeQuery;
    }
    default: {
      return state;
    }
  }
};
