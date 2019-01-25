import * as moment from 'moment';
import { ACTION, Action } from '../../declarations/Action';
import { StatsItem } from '../../veau-entity/StatsItem';

export type StatsEdit = {
  startDate: string;
  selectingItem?: StatsItem;
  selectingRow: number;
};

const initialState: StatsEdit = {
  startDate: moment().format('YYYY-MM-DD'),
  selectingItem: undefined,
  selectingRow: 0
};

export const statsEdit: (state: StatsEdit, action: Action) => StatsEdit = (state: StatsEdit = initialState, action: Action): StatsEdit => {
  switch (action.type) {
    case ACTION.STATS_EDIT_START_DATE_CHANGED: {
      return {
        ...state,
        startDate: action.startDate
      };
    }
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
