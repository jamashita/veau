import { Language } from '@/veau-entity/Language';
import { Region } from '@/veau-entity/Region';
import { ACTION, Action } from '../actions/Action';

export type Locale = {
  languages: Array<Language>;
  regions: Array<Region>;
};

const initialState: Locale = {
  languages: [
  ],
  regions: [
  ]
};

export const locale: (state: Locale, action: Action) => Locale = (state: Locale = initialState, action: Action): Locale => {
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
    default: {
      return state;
    }
  }
};
