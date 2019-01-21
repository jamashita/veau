import { ACTION, Action } from '../../declarations/Action';
import { Language } from '../../veau-vo/Language';
import { Region } from '../../veau-vo/Region';

export type Locales = {
  languages: Array<Language>;
  regions: Array<Region>;
};

const initialState: Locales = {
  languages: [
  ],
  regions: [
  ]
};

export const locales: (state: Locales, action: Action) => Locales = (state: Locales = initialState, action: Action): Locales => {
  switch (action.type) {
    case ACTION.LOCALE_DEFINED: {
      const {
        languages,
        regions
      } = action;

      return {
        languages,
        regions
      };
    }
    default: {
      return state;
    }
  }
};
