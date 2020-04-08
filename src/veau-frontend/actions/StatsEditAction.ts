import { StatsItem } from '../../veau-entity/StatsItem';
import { AsOf } from '../../veau-vo/AsOf';
import { Column } from '../../veau-vo/Column';
import { Coordinate } from '../../veau-vo/Coordinate';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { NumericalValue } from '../../veau-vo/NumericalValue';
import { Row } from '../../veau-vo/Row';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsItemName } from '../../veau-vo/StatsItemName';
import { StatsName } from '../../veau-vo/StatsName';
import { StatsUnit } from '../../veau-vo/StatsUnit';
import {
  ACTION,
  StatsEditClearSelectingItemAction,
  StatsEditDataDeletedAction,
  StatsEditDataFilledAction,
  StatsEditInitializationFailureAction,
  StatsEditInitializeAction,
  StatsEditInvalidDateInputAction,
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

export const initStatsEdit = (statsID: StatsID): StatsEditInitializeAction => {
  return {
    type: ACTION.STATS_EDIT_INITIALIZE,
    statsID
  };
};

export const initFailed = (): StatsEditInitializationFailureAction => {
  return {
    type: ACTION.STATS_EDIT_INITIALIZATION_FAILURE
  };
};

export const statsNameTyped = (name: StatsName): StatsEditNameTypedAction => {
  return {
    type: ACTION.STATS_EDIT_NAME_TYPED,
    name
  };
};

export const statsUnitTyped = (unit: StatsUnit): StatsEditUnitTypedAction => {
  return {
    type: ACTION.STATS_EDIT_UNIT_TYPED,
    unit
  };
};

export const statsISO639Selected = (iso639: ISO639): StatsEditISO639SelectedAction => {
  return {
    type: ACTION.STATS_EDIT_ISO639_SELECTED,
    iso639
  };
};

export const statsISO3166Selected = (iso3166: ISO3166): StatsEditISO3166SelectedAction => {
  return {
    type: ACTION.STATS_EDIT_ISO3166_SELECTED,
    iso3166
  };
};

export const statsDataFilled = (coordinate: Coordinate, value: NumericalValue): StatsEditDataFilledAction => {
  return {
    type: ACTION.STATS_EDIT_DATA_FILLED,
    coordinate,
    value
  };
};

export const statsDataDeleted = (coordinate: Coordinate): StatsEditDataDeletedAction => {
  return {
    type: ACTION.STATS_EDIT_DATA_DELETED,
    coordinate
  };
};

export const itemNameTyped = (name: StatsItemName): StatsEditItemNameTypedAction => {
  return {
    type: ACTION.STATS_EDIT_ITEM_NAME_TYPED,
    name
  };
};

export const saveItem = (): StatsEditItemSaveAction => {
  return {
    type: ACTION.STATS_EDIT_ITEM_SAVE
  };
};

export const rowSelected = (row: Row): StatsEditRowSelectedAction => {
  return {
    type: ACTION.STATS_EDIT_ROW_SELECTED,
    row
  };
};

export const selectItem = (statsItem: StatsItem, row: Row): StatsEditSelectItemAction => {
  return {
    type: ACTION.STATS_EDIT_SELECT_ITEM,
    statsItem,
    row
  };
};

export const selectingItemNameTyped = (name: StatsItemName): StatsEditSelectingItemNameTypedAction => {
  return {
    type: ACTION.STATS_EDIT_SELECTING_ITEM_NAME_TYPED,
    name
  };
};

export const startDateDetermined = (startDate: AsOf): StatsEditStartDateDeterminedAction => {
  return {
    type: ACTION.STATS_EDIT_START_DATE_DETERMINED,
    startDate
  };
};

export const invalidDateInput = (): StatsEditInvalidDateInputAction => {
  return {
    type: ACTION.STATS_EDIT_INVALID_DATE_INPUT
  };
};

export const updateSelectingItem = (statsItem: StatsItem): StatsEditUpdateSelectingItemAction => {
  return {
    type: ACTION.STATS_EDIT_UPDATE_SELECTING_ITEM,
    statsItem
  };
};

export const rowMoved = (column: Column, target: Column): StatsEditRowMovedAction => {
  return {
    type: ACTION.STATS_EDIT_ROW_MOVED,
    column,
    target
  };
};

export const invalidValueInput = (): StatsEditInvalidValueInputAction => {
  return {
    type: ACTION.STATS_EDIT_INVALID_VALUE_INPUT
  };
};

export const removeItem = (statsItem: StatsItem): StatsEditRemoveSelectingItemAction => {
  return {
    type: ACTION.STATS_EDIT_REMOVE_SELECTING_ITEM,
    statsItem
  };
};

export const clearSelectingItem = (): StatsEditClearSelectingItemAction => {
  return {
    type: ACTION.STATS_EDIT_CLEAR_SELECTING_ITEM
  };
};

export const saveStats = (): StatsEditSaveStatsAction => {
  return {
    type: ACTION.STATS_EDIT_SAVE_STATS
  };
};
