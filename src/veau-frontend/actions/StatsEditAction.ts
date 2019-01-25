import {
  ACTION,
  StatsEditDataFilledAction,
  StatsEditLanguageSelectedAction,
  StatsEditNameTypedAction,
  StatsEditRegionSelectedAction,
  StatsEditTermSelectedActoin
} from '../../declarations/Action';
import { Language } from '../../veau-vo/Language';
import { Region } from '../../veau-vo/Region';
import { Term } from '../../veau-vo/Term';

export const statsNameTyped: (name: string) => StatsEditNameTypedAction = (name: string): StatsEditNameTypedAction => {
  return {
    type: ACTION.STATS_EDIT_NAME_TYPED,
    name
  };
};

export const statsLanguageSelected: (language: Language) => StatsEditLanguageSelectedAction = (language: Language): StatsEditLanguageSelectedAction => {
  return {
    type: ACTION.STATS_EDIT_LANGUAGE_SELECTED,
    language
  };
};

export const statsRegionSelected: (region: Region) => StatsEditRegionSelectedAction = (region: Region): StatsEditRegionSelectedAction => {
  return {
    type: ACTION.STATS_EDIT_REGION_SELECTED,
    region
  };
};

export const statsTermSelected: (term: Term) => StatsEditTermSelectedActoin = (term: Term): StatsEditTermSelectedActoin => {
  return {
    type: ACTION.STATS_EDIT_TERM_SELECTED,
    term
  };
};

export const statsDataFilled: (row: number, column: number, value: number) => StatsEditDataFilledAction = (row: number, column: number, value: number): StatsEditDataFilledAction => {
  return {
    type: ACTION.STATS_EDIT_DATA_FILLED,
    row,
    column,
    value
  };
};
