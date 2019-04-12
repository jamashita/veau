import { LocaleMemoryQuery } from '../../veau-query/LocaleMemoryQuery';
import { ACTION, Action } from '../actions/Action';

const initialState: LocaleMemoryQuery = LocaleMemoryQuery.getInstance(
  [
  ],
  [
  ]
);

export const localeMemoryQuery: (state: LocaleMemoryQuery, action: Action) => LocaleMemoryQuery = (state: LocaleMemoryQuery = initialState, action: Action): LocaleMemoryQuery => {
  switch (action.type) {
    case ACTION.LOCALE_DEFINED: {
      return action.localeMemoryQuery;
    }
    default: {
      return state;
    }
  }
};
