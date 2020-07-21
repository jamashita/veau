import { Absent, Heisenberg } from '@jamashita/publikum-monad';
import { Reducer } from 'redux';
import { Stats } from '../../Entity/Stats/Stats';

import { StatsItem } from '../../Entity/StatsItem/StatsItem';
import { Row } from '../../VO/Coordinate/Row';
import { StatsDisplay } from '../../VO/Display/StatsDisplay';
import {
  STATS_DISPLAY_RESET,
  STATS_DISPLAY_UPDATE,
  STATS_EDIT_CLEAR_SELECTING_ITEM,
  STATS_EDIT_SELECT_ITEM,
  STATS_EDIT_UPDATE_SELECTING_ITEM,
  STATS_RESET,
  STATS_UPDATE,
  VeauAction
} from '../Action';

export type StatsEdit = Readonly<{
  stats: Stats;
  display: Heisenberg<StatsDisplay>;
  selectingItem: Heisenberg<StatsItem>;
  selectingRow: Row;
}>;

const initialState: StatsEdit = {
  stats: Stats.default(),
  display: Absent.of<StatsDisplay>(),
  selectingItem: Absent.of<StatsItem>(),
  selectingRow: Row.origin()
};

export const statsEdit: Reducer<StatsEdit, VeauAction> = (state: StatsEdit = initialState, action: VeauAction) => {
  switch (action.type) {
    case STATS_UPDATE: {
      return {
        ...state,
        stats: action.stats
      };
    }
    case STATS_RESET: {
      return {
        ...state,
        stats: Stats.default(),
        display: Absent.of<StatsDisplay>()
      };
    }
    case STATS_DISPLAY_UPDATE: {
      return {
        ...state,
        display: action.display
      };
    }
    case STATS_DISPLAY_RESET: {
      return {
        ...state,
        display: Absent.of<StatsDisplay>()
      };
    }
    case STATS_EDIT_SELECT_ITEM: {
      // prettier-ignore
      const {
        statsItem,
        row
      } = action;

      return {
        ...state,
        selectingItem: statsItem,
        selectingRow: row
      };
    }
    case STATS_EDIT_UPDATE_SELECTING_ITEM: {
      // prettier-ignore
      const {
        statsItem
      } = action;

      return {
        ...state,
        selectingItem: statsItem
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
