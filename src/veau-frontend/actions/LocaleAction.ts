import { Language } from '../../veau-entity/Language';
import { Region } from '../../veau-entity/Region';
import { ACTION, LanguageDefinedAction, RegionDefinedAction } from './Action';

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
