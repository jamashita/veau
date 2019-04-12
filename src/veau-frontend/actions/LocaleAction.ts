import { LocaleMemoryQuery } from '../../veau-query/LocaleMemoryQuery';
import { ACTION, LocaleDefinedAction } from './Action';

export const defineLocale: (localeMemoryQuery: LocaleMemoryQuery) => LocaleDefinedAction = (localeMemoryQuery: LocaleMemoryQuery): LocaleDefinedAction => {
  return {
    type: ACTION.LOCALE_DEFINED,
    localeMemoryQuery
  };
};
