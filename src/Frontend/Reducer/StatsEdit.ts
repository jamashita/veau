import { Absent, Heisenberg } from '@jamashita/publikum-monad';
import { Reducer } from 'redux';
import { Stats } from '../../Entity/Stats/Stats';

import { StatsItem } from '../../Entity/StatsItem/StatsItem';
import { Row } from '../../VO/Coordinate/Row';
import { StatsDisplay } from '../../VO/Display/StatsDisplay';
import {
  STATS_EDIT_CLEAR_SELECTING_ITEM,
  STATS_EDIT_RESET_STATS,
  STATS_EDIT_RESET_STATS_DISPLAY,
  STATS_EDIT_RESET_STATS_ITEM,
  STATS_EDIT_SELECT_ITEM,
  STATS_EDIT_UPDATE_SELECTING_ITEM,
  STATS_EDIT_UPDATE_STATS,
  STATS_EDIT_UPDATE_STATS_DISPLAY,
  STATS_EDIT_UPDATE_STATS_ITEM,
  VeauAction
} from '../Action';

export type StatsEdit = Readonly<{
  stats: Stats;
  display: StatsDisplay;
  item: StatsItem;
  selectingItem: Heisenberg<StatsItem>;
  selectingRow: Row;
}>;

const initialState: StatsEdit = {
  stats: Stats.default(),
  display: StatsDisplay.default(),
  item: StatsItem.default(),
  selectingItem: Absent.of<StatsItem>(),
  selectingRow: Row.origin()
};

export const statsEdit: Reducer<StatsEdit, VeauAction> = (state: StatsEdit = initialState, action: VeauAction) => {
  switch (action.type) {
    case STATS_EDIT_UPDATE_STATS: {
      return {
        ...state,
        stats: action.stats
      };
    }
    case STATS_EDIT_RESET_STATS: {
      return {
        ...state,
        stats: Stats.default(),
        display: StatsDisplay.default()
      };
    }
    case STATS_EDIT_UPDATE_STATS_DISPLAY: {
      return {
        ...state,
        display: action.display
      };
    }
    case STATS_EDIT_RESET_STATS_DISPLAY: {
      return {
        ...state,
        display: StatsDisplay.default()
      };
    }
    case STATS_EDIT_UPDATE_STATS_ITEM: {
      return {
        ...state,
        item: action.item
      };
    }
    case STATS_EDIT_RESET_STATS_ITEM: {
      return {
        ...state,
        item: StatsItem.default()
      };
    }
    case STATS_EDIT_SELECT_ITEM: {
      const {
        item,
        row
      } = action;

      return {
        ...state,
        selectingItem: item,
        selectingRow: row
      };
    }
    case STATS_EDIT_UPDATE_SELECTING_ITEM: {
      const {
        item
      } = action;

      return {
        ...state,
        selectingItem: item
      };
    }
    case STATS_EDIT_CLEAR_SELECTING_ITEM: {
      return {
        ...state,
        selectingItem: Absent.of<StatsItem>()
      };
    }
    default: {
      return state;
    }
  }
};
