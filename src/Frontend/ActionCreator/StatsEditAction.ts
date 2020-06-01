import { Present, Quantum } from '@jamashita/publikum-monad';

import { StatsItem } from '../../Entity/StatsItem/StatsItem';
import { AsOf } from '../../VO/AsOf/AsOf';
import { Column } from '../../VO/Coordinate/Column';
import { Coordinate } from '../../VO/Coordinate/Coordinate';
import { Row } from '../../VO/Coordinate/Row';
import { ISO639 } from '../../VO/Language/ISO639';
import { NumericalValue } from '../../VO/NumericalValue/NumericalValue';
import { ISO3166 } from '../../VO/Region/ISO3166';
import { StatsItemName } from '../../VO/StatsItem/StatsItemName';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { StatsName } from '../../VO/StatsOutline/StatsName';
import { StatsUnit } from '../../VO/StatsOutline/StatsUnit';
import {
  STATS_EDIT_CLEAR_SELECTING_ITEM,
  STATS_EDIT_DATA_DELETED,
  STATS_EDIT_DATA_FILLED,
  STATS_EDIT_INITIALIZATION_FAILURE,
  STATS_EDIT_INITIALIZE,
  STATS_EDIT_INVALID_DATE_INPUT,
  STATS_EDIT_INVALID_VALUE_INPUT,
  STATS_EDIT_ISO3166_SELECTED,
  STATS_EDIT_ISO639_SELECTED,
  STATS_EDIT_ITEM_NAME_TYPED,
  STATS_EDIT_ITEM_SAVE,
  STATS_EDIT_NAME_TYPED,
  STATS_EDIT_REMOVE_SELECTING_ITEM,
  STATS_EDIT_ROW_MOVED,
  STATS_EDIT_ROW_SELECTED,
  STATS_EDIT_SAVE_STATS,
  STATS_EDIT_SELECT_ITEM,
  STATS_EDIT_SELECTING_ITEM_NAME_TYPED,
  STATS_EDIT_START_DATE_DETERMINED,
  STATS_EDIT_UNIT_TYPED,
  STATS_EDIT_UPDATE_SELECTING_ITEM,
  StatsEditClearSelectingItemAction,
  StatsEditDataDeletedAction,
  StatsEditDataFilledAction,
  StatsEditInitializationDeadAction,
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
} from '../Action';

export const initStatsEdit = (statsID: StatsID): StatsEditInitializeAction => {
  return {
    type: STATS_EDIT_INITIALIZE,
    statsID
  };
};

export const initFailed = (): StatsEditInitializationDeadAction => {
  return {
    type: STATS_EDIT_INITIALIZATION_FAILURE
  };
};

export const statsNameTyped = (name: StatsName): StatsEditNameTypedAction => {
  return {
    type: STATS_EDIT_NAME_TYPED,
    name
  };
};

export const statsUnitTyped = (unit: StatsUnit): StatsEditUnitTypedAction => {
  return {
    type: STATS_EDIT_UNIT_TYPED,
    unit
  };
};

export const statsISO639Selected = (iso639: ISO639): StatsEditISO639SelectedAction => {
  return {
    type: STATS_EDIT_ISO639_SELECTED,
    iso639
  };
};

export const statsISO3166Selected = (iso3166: ISO3166): StatsEditISO3166SelectedAction => {
  return {
    type: STATS_EDIT_ISO3166_SELECTED,
    iso3166
  };
};

export const statsDataFilled = (coordinate: Coordinate, value: NumericalValue): StatsEditDataFilledAction => {
  return {
    type: STATS_EDIT_DATA_FILLED,
    coordinate,
    value
  };
};

export const statsDataDeleted = (coordinate: Coordinate): StatsEditDataDeletedAction => {
  return {
    type: STATS_EDIT_DATA_DELETED,
    coordinate
  };
};

export const itemNameTyped = (name: StatsItemName): StatsEditItemNameTypedAction => {
  return {
    type: STATS_EDIT_ITEM_NAME_TYPED,
    name
  };
};

export const saveItem = (): StatsEditItemSaveAction => {
  return {
    type: STATS_EDIT_ITEM_SAVE
  };
};

export const rowSelected = (row: Row): StatsEditRowSelectedAction => {
  return {
    type: STATS_EDIT_ROW_SELECTED,
    row
  };
};

export const selectItem = (statsItem: Quantum<StatsItem>, row: Row): StatsEditSelectItemAction => {
  return {
    type: STATS_EDIT_SELECT_ITEM,
    statsItem,
    row
  };
};

export const selectingItemNameTyped = (name: StatsItemName): StatsEditSelectingItemNameTypedAction => {
  return {
    type: STATS_EDIT_SELECTING_ITEM_NAME_TYPED,
    name
  };
};

export const startDateDetermined = (startDate: AsOf): StatsEditStartDateDeterminedAction => {
  return {
    type: STATS_EDIT_START_DATE_DETERMINED,
    startDate
  };
};

export const invalidDateInput = (): StatsEditInvalidDateInputAction => {
  return {
    type: STATS_EDIT_INVALID_DATE_INPUT
  };
};

export const updateSelectingItem = (statsItem: Present<StatsItem>): StatsEditUpdateSelectingItemAction => {
  return {
    type: STATS_EDIT_UPDATE_SELECTING_ITEM,
    statsItem
  };
};

export const rowMoved = (column: Column, target: Column): StatsEditRowMovedAction => {
  return {
    type: STATS_EDIT_ROW_MOVED,
    column,
    target
  };
};

export const invalidValueInput = (): StatsEditInvalidValueInputAction => {
  return {
    type: STATS_EDIT_INVALID_VALUE_INPUT
  };
};

export const removeItem = (statsItem: StatsItem): StatsEditRemoveSelectingItemAction => {
  return {
    type: STATS_EDIT_REMOVE_SELECTING_ITEM,
    statsItem
  };
};

export const clearSelectingItem = (): StatsEditClearSelectingItemAction => {
  return {
    type: STATS_EDIT_CLEAR_SELECTING_ITEM
  };
};

export const saveStats = (): StatsEditSaveStatsAction => {
  return {
    type: STATS_EDIT_SAVE_STATS
  };
};
