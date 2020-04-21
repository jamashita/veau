import { Locale } from '../../VO/Locale';
import { LOCALE_DEFINED, LocaleDefinedAction } from './Action';

export const defineLocale = (locale: Locale): LocaleDefinedAction => {
  return {
    type: LOCALE_DEFINED,
    locale
  };
};
