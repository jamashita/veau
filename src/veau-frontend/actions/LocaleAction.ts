import { Locale } from '../../veau-vo/Locale';
import { ACTION, LocaleDefinedAction } from './Action';

export const defineLocale = (locale: Locale): LocaleDefinedAction => {
  return {
    type: ACTION.LOCALE_DEFINED,
    locale
  };
};
