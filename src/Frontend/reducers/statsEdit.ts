import { Reducer } from 'redux';
import { StatsItem } from '../../Entity/StatsItem';
import { Row } from '../../VO/Row';
import { ACTION, Action } from '../actions/Action';

export type StatsEdit = Readonly<{
  selectingItem?: StatsItem;
  selectingRow: Row;
}>;

const initialState: StatsEdit = {
  selectingRow: Row.default()
};

export const statsEdit: Reducer<StatsEdit, Action> = (
  state: StatsEdit = initialState,
  action: Action
) => {
  switch (action.type) {
    case ACTION.STATS_EDIT_SELECT_ITEM: {
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
    case ACTION.STATS_EDIT_UPDATE_SELECTING_ITEM: {
      const {
        statsItem
      } = action;

      return {
        ...state,
        selectingItem: statsItem
      };
    }
    case ACTION.STATS_EDIT_CLEAR_SELECTING_ITEM: {
      return {
        ...state,
        selectingItem: undefined
      };
    }
    default: {
      return state;
    }
  }
};
