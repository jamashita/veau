import { Stats } from '../../domain/entity/Stats/Stats';
import { StatsItem } from '../../domain/entity/StatsItem/StatsItem';
import { AsOf } from '../../domain/vo/AsOf/AsOf';
import { Column } from '../../domain/vo/Coordinate/Column';
import { Coordinate } from '../../domain/vo/Coordinate/Coordinate';
import { Row } from '../../domain/vo/Coordinate/Row';
import { ISO639 } from '../../domain/vo/Language/ISO639';
import { NumericalValue } from '../../domain/vo/NumericalValue/NumericalValue';
import { ISO3166 } from '../../domain/vo/Region/ISO3166';
import { StatsItemName } from '../../domain/vo/StatsItem/StatsItemName';
import { StatsID } from '../../domain/vo/StatsOutline/StatsID';
import { StatsName } from '../../domain/vo/StatsOutline/StatsName';
import { StatsUnit } from '../../domain/vo/StatsOutline/StatsUnit';
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
  STATS_EDIT_RESET_STATS,
  STATS_EDIT_RESET_STATS_ITEM,
  STATS_EDIT_ROW_MOVED,
  STATS_EDIT_ROW_SELECTED,
  STATS_EDIT_SAVE_STATS,
  STATS_EDIT_SELECT_ITEM,
  STATS_EDIT_SELECTING_ITEM_NAME_TYPED,
  STATS_EDIT_START_DATE_DETERMINED,
  STATS_EDIT_UNIT_TYPED,
  STATS_EDIT_UPDATE_SELECTING_ITEM,
  STATS_EDIT_UPDATE_STATS,
  STATS_EDIT_UPDATE_STATS_ITEM,
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
  StatsEditResetStatsAction,
  StatsEditResetStatsItemAction,
  StatsEditRowMovedAction,
  StatsEditRowSelectedAction,
  StatsEditSaveStatsAction,
  StatsEditSelectingItemNameTypedAction,
  StatsEditSelectItemAction,
  StatsEditStartDateDeterminedAction,
  StatsEditUnitTypedAction,
  StatsEditUpdateSelectingItemAction,
  StatsEditUpdateStatsAction,
  StatsEditUpdateStatsItemAction
} from '../Action';

export const initStatsEdit = (statsID: StatsID): StatsEditInitializeAction => {
  return {
    type: STATS_EDIT_INITIALIZE,
    statsID
  };
};

export const initFailed = (): StatsEditInitializationFailureAction => {
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

export const selectItem = (item: StatsItem, row: Row): StatsEditSelectItemAction => {
  return {
    type: STATS_EDIT_SELECT_ITEM,
    item,
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

export const updateSelectingItem = (item: StatsItem): StatsEditUpdateSelectingItemAction => {
  return {
    type: STATS_EDIT_UPDATE_SELECTING_ITEM,
    item
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

export const removeItem = (item: StatsItem): StatsEditRemoveSelectingItemAction => {
  return {
    type: STATS_EDIT_REMOVE_SELECTING_ITEM,
    item
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

export const updateStats = (stats: Stats): StatsEditUpdateStatsAction => {
  return {
    type: STATS_EDIT_UPDATE_STATS,
    stats
  };
};

export const resetStats = (): StatsEditResetStatsAction => {
  return {
    type: STATS_EDIT_RESET_STATS
  };
};

export const updateStatsItem = (item: StatsItem): StatsEditUpdateStatsItemAction => {
  return {
    type: STATS_EDIT_UPDATE_STATS_ITEM,
    item
  };
};

export const resetStatsItem = (): StatsEditResetStatsItemAction => {
  return {
    type: STATS_EDIT_RESET_STATS_ITEM
  };
};
