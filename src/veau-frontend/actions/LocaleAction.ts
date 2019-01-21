import { ACTION, LocaleDefinedAction } from '../../declarations/Action';
import { Language } from '../../veau-vo/Language';
import { Region } from '../../veau-vo/Region';

export const defineLocale: (languages: Array<Language>, regions: Array<Region>) => LocaleDefinedAction = (languages: Array<Language>, regions: Array<Region>): LocaleDefinedAction => {
  return {
    type: ACTION.LOCALE_DEFINED,
    languages,
    regions
  };
};
