import { LocaleQuery } from '../../veau-query/LocaleQuery';
import { ACTION, LocaleDefinedAction } from './Action';

export const defineLocale: (localeQuery: LocaleQuery) => LocaleDefinedAction = (localeQuery: LocaleQuery): LocaleDefinedAction => {
  return {
    type: ACTION.LOCALE_DEFINED,
    localeQuery
  };
};
