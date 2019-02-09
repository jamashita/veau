import { ACTION, LocaleDefinedAction } from '../declarations/Action';
import { LocaleRepository } from '../../veau-repository/LocaleRepository';

export const defineLocale: (localeRepository: LocaleRepository) => LocaleDefinedAction = (localeRepository: LocaleRepository): LocaleDefinedAction => {
  return {
    type: ACTION.LOCALE_DEFINED,
    localeRepository
  };
};
