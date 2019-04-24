import { Language } from '../../veau-vo/Language';
import { Region } from '../../veau-vo/Region';
import { ILocaleQuery } from '../queries/interfaces/ILocaleQuery';
import { ACTION, LanguageDefinedAction, LocaleDefinedAction, RegionDefinedAction } from './Action';

export const defineLanguages: (languages: Array<Language>) => LanguageDefinedAction = (languages: Array<Language>): LanguageDefinedAction => {
  return {
    type: ACTION.LANGUAGES_DEFINED,
    languages
  };
};

export const defineRegions: (regions: Array<Region>) => RegionDefinedAction = (regions: Array<Region>): RegionDefinedAction => {
  return {
    type: ACTION.REGIONS_DEFINED,
    regions
  };
};

export const defineLocale: (localeQuery: ILocaleQuery) => LocaleDefinedAction = (localeQuery: ILocaleQuery): LocaleDefinedAction => {
  return {
    type: ACTION.LOCALE_DEFINED,
    localeQuery
  };
};
