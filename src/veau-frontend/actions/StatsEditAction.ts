import { StatsItem } from '@/veau-entity/StatsItem';
import { ISO3166 } from '@/veau-vo/ISO3166';
import { ISO639 } from '@/veau-vo/ISO639';
import {
  ACTION,
  StatsEditClearSelectingItemAction,
  StatsEditDataDeletedAction,
  StatsEditDataFilledAction,
  StatsEditInvalidValueInputAction,
  StatsEditISO3166SelectedAction,
  StatsEditISO639SelectedAction,
  StatsEditItemNameTypedAction,
  StatsEditItemSaveAction,
  StatsEditNameTypedAction,
  StatsEditRemoveSelectingItemAction,
  StatsEditRowMovedAction,
  StatsEditRowSelectedAction,
  StatsEditSaveStatsAction,
  StatsEditSelectingItemNameTypedAction,
  StatsEditSelectItemAction,
  StatsEditStartDateDeterminedAction,
  StatsEditUnitTypedAction,
  StatsEditUpdateSelectingItemAction
} from './Action';

export const statsNameTyped: (name: string) => StatsEditNameTypedAction = (name: string): StatsEditNameTypedAction => {
  return {
    type: ACTION.STATS_EDIT_NAME_TYPED,
    name
  };
};

export const statsUnitTyped: (unit: string) => StatsEditUnitTypedAction = (unit: string): StatsEditUnitTypedAction => {
  return {
    type: ACTION.STATS_EDIT_UNIT_TYPED,
    unit
  };
};

export const statsISO639Selected: (iso639: ISO639) => StatsEditISO639SelectedAction = (iso639: ISO639): StatsEditISO639SelectedAction => {
  return {
    type: ACTION.STATS_EDIT_ISO639_SELECTED,
    iso639
  };
};

export const statsISO3166Selected: (iso3166: ISO3166) => StatsEditISO3166SelectedAction = (iso3166: ISO3166): StatsEditISO3166SelectedAction => {
  return {
    type: ACTION.STATS_EDIT_ISO3166_SELECTED,
    iso3166
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

export const selectItem: (statsItem: StatsItem, row: number) => StatsEditSelectItemAction = (statsItem: StatsItem, row: number): StatsEditSelectItemAction => {
  return {
    type: ACTION.STATS_EDIT_SELECT_ITEM,
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
