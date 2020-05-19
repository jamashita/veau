import { Absent, Quantum } from 'publikum';
import { Reducer } from 'redux';
import { StatsItem } from '../../Entity/StatsItem';
import { Row } from '../../VO/Coordinate/Row';
import {
  Action,
  STATS_EDIT_CLEAR_SELECTING_ITEM,
  STATS_EDIT_SELECT_ITEM,
  STATS_EDIT_UPDATE_SELECTING_ITEM
} from '../Action/Action';

export type StatsEdit = Readonly<{
  selectingItem: Quantum<StatsItem>;
  selectingRow: Row;
}>;

const initialState: StatsEdit = {
  selectingItem: Absent.of<StatsItem>(),
  selectingRow: Row.origin()
};

export const statsEdit: Reducer<StatsEdit, Action> = (state: StatsEdit = initialState, action: Action) => {
  switch (action.type) {
    case STATS_EDIT_SELECT_ITEM: {
      const { statsItem, row } = action;

      return {
        ...state,
        selectingItem: statsItem,
        selectingRow: row
      };
    }
    case STATS_EDIT_UPDATE_SELECTING_ITEM: {
      const { statsItem } = action;

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
