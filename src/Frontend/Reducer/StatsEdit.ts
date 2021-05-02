import { Nullable } from '@jamashita/anden-type';
import { Reducer } from 'redux';
import { Stats } from '../../domain/Entity/Stats/Stats';
import { StatsItem } from '../../domain/Entity/StatsItem/StatsItem';
import { Row } from '../../domain/VO/Coordinate/Row';
import {
  STATS_EDIT_CLEAR_SELECTING_ITEM,
  STATS_EDIT_RESET_STATS,
  STATS_EDIT_RESET_STATS_ITEM,
  STATS_EDIT_SELECT_ITEM,
  STATS_EDIT_UPDATE_SELECTING_ITEM,
  STATS_EDIT_UPDATE_STATS,
  STATS_EDIT_UPDATE_STATS_ITEM,
  VeauAction
} from '../Action';

const initialState: StatsEdit = {
  stats: Stats.default(),
  item: StatsItem.default(),
  selectingItem: null,
  selectingRow: Row.origin()
};

export type StatsEdit = Readonly<{
  stats: Stats;
  item: StatsItem;
  selectingItem: Nullable<StatsItem>;
  selectingRow: Row;
}>;

export const statsEdit: Reducer<StatsEdit, VeauAction> = (
  state: StatsEdit = initialState,
  action: VeauAction
) => {
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
        stats: Stats.default()
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
        selectingItem: null
      };
    }
    default: {
      return state;
    }
  }
};
