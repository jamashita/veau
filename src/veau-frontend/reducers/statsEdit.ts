import { ACTION, Action } from '../../declarations/Action';
import { StatsItem } from '../../veau-entity/StatsItem';

export type StatsEdit = {
  selectingItem?: StatsItem;
  selectingRow: number;
};

const initialState: StatsEdit = {
  selectingItem: undefined,
  selectingRow: 0
};

export const statsEdit: (state: StatsEdit, action: Action) => StatsEdit = (state: StatsEdit = initialState, action: Action): StatsEdit => {
  switch (action.type) {
    case ACTION.STATS_EDIT_ITEM_SELECTING: {
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
    default: {
      return state;
    }
  }
};
