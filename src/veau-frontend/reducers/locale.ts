import { Language } from '../../veau-vo/Language';
import { Region } from '../../veau-vo/Region';
import { ACTION, Action } from '../actions/Action';
import { ILocaleQuery } from '../queries/interfaces/ILocaleQuery';
import { LocaleMemoryQuery } from '../queries/LocaleMemoryQuery';

export type Locale = {
  languages: Array<Language>;
  regions: Array<Region>;
  query: ILocaleQuery;
};

const initialState: Locale = {
  languages: [
  ],
  regions: [
  ],
  query: LocaleMemoryQuery.getInstance(
    [
    ],
    [
    ]
  );
};

export const locale: (state: Locale, action: Action) => ILocaleQuery = (state: Locale = initialState, action: Action): Locale => {
  switch (action.type) {
    case ACTION.LANGUAGES_DEFINED: {
      return {
        ...state,
        languages: action.languages
      };
    }
    case ACTION.REGIONS_DEFINED: {
      return {
        ...state,
        regions: action.regions
      };
    }
    case ACTION.LOCALE_DEFINED: {
      return {
        ...state,
        query: action.localeQuery
      };
    }
    default: {
      return state;
    }
  }
};
