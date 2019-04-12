import { LocaleMemoryQuery } from '../../veau-query/LocaleQuery';
import { ACTION, LocaleDefinedAction } from './Action';

export const defineLocale: (localeQuery: LocaleMemoryQuery) => LocaleDefinedAction = (localeQuery: LocaleMemoryQuery): LocaleDefinedAction => {
  return {
    type: ACTION.LOCALE_DEFINED,
    localeQuery
  };
};
