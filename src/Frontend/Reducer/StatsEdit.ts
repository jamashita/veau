import { Reducer } from 'redux';

import { Absent, Quantum } from '@jamashita/publikum-monad';

import { StatsItem } from '../../Entity/StatsItem/StatsItem';
import { Row } from '../../VO/Coordinate/Row';
import {
    STATS_EDIT_CLEAR_SELECTING_ITEM, STATS_EDIT_SELECT_ITEM, STATS_EDIT_UPDATE_SELECTING_ITEM,
    VeauAction
} from '../Action/Action';

export type StatsEdit = Readonly<{
  selectingItem: Quantum<StatsItem>;
  selectingRow: Row;
}>;

const initialState: StatsEdit = {
  selectingItem: Absent.of<StatsItem>(),
  selectingRow: Row.origin()
};

export const statsEdit: Reducer<StatsEdit, VeauAction> = (state: StatsEdit = initialState, action: VeauAction) => {
  switch (action.type) {
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
