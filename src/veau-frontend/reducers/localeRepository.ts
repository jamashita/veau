import { ACTION, Action } from '../../declarations/Action';
import { LocaleRepository } from '../../veau-repository/LocaleRepository';

const initialState: LocaleRepository = LocaleRepository.getInstance(
  [
  ],
  [
  ]
);

export const localeRepository: (state: LocaleRepository, action: Action) => LocaleRepository = (state: LocaleRepository = initialState, action: Action): LocaleRepository => {
  switch (action.type) {
    case ACTION.LOCALE_DEFINED: {
      const {
        languages,
        regions
      } = action;

      return LocaleRepository.getInstance(languages, regions);
    }
    default: {
      return state;
    }
  }
};
