import { LocaleRepository } from '../../veau-repository/LocaleRepository';
import { ACTION, Action } from '../actions/Action';

const initialState: LocaleRepository = LocaleRepository.getInstance(
  [
  ],
  [
  ]
);

export const localeRepository: (state: LocaleRepository, action: Action) => LocaleRepository = (state: LocaleRepository = initialState, action: Action): LocaleRepository => {
  switch (action.type) {
    case ACTION.LOCALE_DEFINED: {
      return action.localeRepository;
    }
    default: {
      return state;
    }
  }
};
