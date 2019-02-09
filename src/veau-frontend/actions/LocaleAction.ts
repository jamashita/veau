import { LocaleRepository } from '../../veau-repository/LocaleRepository';
import { ACTION, LocaleDefinedAction } from './Action';

export const defineLocale: (localeRepository: LocaleRepository) => LocaleDefinedAction = (localeRepository: LocaleRepository): LocaleDefinedAction => {
  return {
    type: ACTION.LOCALE_DEFINED,
    localeRepository
  };
};
