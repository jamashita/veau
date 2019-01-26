import {
  ACTION,
  StatsEditDataDeletedAction,
  StatsEditDataFilledAction,
  StatsEditItemNameTypedAction,
  StatsEditItemSaveAction,
  StatsEditItemSelectingAction,
  StatsEditItemUnitTypedAction,
  StatsEditLanguageSelectedAction,
  StatsEditNameTypedAction,
  StatsEditRegionSelectedAction,
  StatsEditRowSelectedAction,
  StatsEditSelectingItemNameTypedAction,
  StatsEditSelectingItemUnitTypedAction,
  StatsEditStartDateDeterminedAction,
  StatsEditTermSelectedActoin,
  StatsEditUpdateSelectingItemAction
} from '../../declarations/Action';
import { StatsItem } from '../../veau-entity/StatsItem';
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

export const rowSelected: (row: number) => StatsEditRowSelectedAction = (row: number): StatsEditRowSelectedAction => {
  return {
    type: ACTION.STATS_EDIT_ROW_SELECTED,
    row
  };
};

export const itemSelecting: (statsItem: StatsItem, row: number) => StatsEditItemSelectingAction = (statsItem: StatsItem, row: number): StatsEditItemSelectingAction => {
  return {
    type: ACTION.STATS_EDIT_ITEM_SELECTING,
    statsItem,
    row
  };
};

export const selectingItemNameTyped: (name: string) => StatsEditSelectingItemNameTypedAction = (name: string): StatsEditSelectingItemNameTypedAction => {
  return {
    type: ACTION.STATS_EDIT_SELECTING_ITEM_NAME_TYPED,
    name
  };
};

export const selectingItemUnitTyped: (unit: string) => StatsEditSelectingItemUnitTypedAction = (unit: string): StatsEditSelectingItemUnitTypedAction => {
  return {
    type: ACTION.STATS_EDIT_SELECTING_ITEM_UNIT_TYPED,
    unit
  };
};

export const startDateDetermined: (startDate: string) => StatsEditStartDateDeterminedAction = (startDate: string): StatsEditStartDateDeterminedAction => {
  return {
    type: ACTION.STATS_EDIT_START_DATE_DETERMINED,
    startDate
  };
};

export const updateSelectingItem: (statsItem: StatsItem) => StatsEditUpdateSelectingItemAction = (statsItem: StatsItem): StatsEditUpdateSelectingItemAction => {
  return {
    type: ACTION.STATS_EDIT_UPDATE_SELECTING_ITEM,
    statsItem
  };
};
