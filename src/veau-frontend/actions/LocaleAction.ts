import { Locale } from '../../veau-vo/Locale';
import { ACTION, LocaleDefinedAction } from './Action';

export const defineLocale: (locale: Locale) => LocaleDefinedAction = (locale: Locale) => {
  return {
    type: ACTION.LOCALE_DEFINED,
    locale
  };
};
