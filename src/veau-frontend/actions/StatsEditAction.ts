import {
  ACTION,
  StatsEditCloseItemModalAction,
  StatsEditDataDeletedAction,
  StatsEditDataFilledAction,
  StatsEditItemNameTypedAction,
  StatsEditItemSaveAction,
  StatsEditItemUnitTypedAction,
  StatsEditLanguageSelectedAction,
  StatsEditNameTypedAction,
  StatsEditNewItemAction,
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

export const statsDataDeleted: (row: number, column: number) => StatsEditDataDeletedAction = (row: number, column: number): StatsEditDataDeletedAction => {
  return {
    type: ACTION.STATS_EDIT_DATA_DELETED,
    row,
    column
  };
};

export const newItem: () => StatsEditNewItemAction = (): StatsEditNewItemAction => {
  return {
    type: ACTION.STATS_EDIT_NEW_ITEM
  };
};

export const closeItemModal: () => StatsEditCloseItemModalAction = (): StatsEditCloseItemModalAction => {
  return {
    type: ACTION.STATS_EDIT_CLOSE_ITEM_MODAL
  };
};

export const itemNameTyped: (name: string) => StatsEditItemNameTypedAction = (name: string): StatsEditItemNameTypedAction => {
  return {
    type: ACTION.STATS_EDIT_ITEM_NAME_TYPED,
    name
  };
};

export const itemUnitTyped: (unit: string) => StatsEditItemUnitTypedAction = (unit: string): StatsEditItemUnitTypedAction => {
  return {
    type: ACTION.STATS_EDIT_ITEM_UNIT_TYPED,
    unit
  };
};

export const saveItem: () => StatsEditItemSaveAction = (): StatsEditItemSaveAction => {
  return {
    type: ACTION.STATS_EDIT_ITEM_SAVE
  };
};
