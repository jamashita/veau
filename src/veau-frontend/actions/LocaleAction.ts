import { LocaleAJAXQuery } from '../../veau-query/LocaleAJAXQuery';
import { ACTION, LocaleDefinedAction } from './Action';

export const defineLocale: (localeQuery: LocaleAJAXQuery) => LocaleDefinedAction = (localeQuery: LocaleAJAXQuery): LocaleDefinedAction => {
  return {
    type: ACTION.LOCALE_DEFINED,
    localeQuery
  };
};
