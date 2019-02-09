import { StatsItem } from '../../veau-entity/StatsItem';
import { Term } from '../../veau-enum/Term';
import { Language } from '../../veau-vo/Language';
import { Region } from '../../veau-vo/Region';
import {
  ACTION,
  StatsEditClearSelectingItemAction,
  StatsEditDataDeletedAction,
  StatsEditDataFilledAction,
  StatsEditInvalidValueInputAction,
  StatsEditItemNameTypedAction,
  StatsEditItemSaveAction,
  StatsEditItemSelectingAction,
  StatsEditItemUnitTypedAction,
  StatsEditLanguageSelectedAction,
  StatsEditNameTypedAction,
  StatsEditRegionSelectedAction,
  StatsEditRemoveSelectingItemAction,
  StatsEditRowMovedAction,
  StatsEditRowSelectedAction,
  StatsEditSaveStatsAction,
  StatsEditSelectingItemNameTypedAction,
  StatsEditSelectingItemUnitTypedAction,
  StatsEditStartDateDeterminedAction,
  StatsEditTermSelectedActoin,
  StatsEditUpdateSelectingItemAction
} from './Action';

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

export const rowMoved: (column: number, target: number) => StatsEditRowMovedAction = (column: number, target: number): StatsEditRowMovedAction => {
  return {
    type: ACTION.STATS_EDIT_ROW_MOVED,
    column,
    target
  };
};

export const invalidValueInput: () => StatsEditInvalidValueInputAction = (): StatsEditInvalidValueInputAction => {
  return {
    type: ACTION.STATS_EDIT_INVALID_VALUE_INPUT
  };
};

export const removeItem: (statsItem: StatsItem) => StatsEditRemoveSelectingItemAction = (statsItem: StatsItem): StatsEditRemoveSelectingItemAction => {
  return {
    type: ACTION.STATS_EDIT_REMOVE_SELECTING_ITEM,
    statsItem
  };
};

export const clearSelectingItem: () => StatsEditClearSelectingItemAction = (): StatsEditClearSelectingItemAction => {
  return {
    type: ACTION.STATS_EDIT_CLEAR_SELECTING_ITEM
  };
};

export const saveStats: () => StatsEditSaveStatsAction = (): StatsEditSaveStatsAction => {
  return {
    type: ACTION.STATS_EDIT_SAVE_STATS
  };
};
