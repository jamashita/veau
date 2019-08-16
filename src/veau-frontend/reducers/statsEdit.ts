import { Reducer } from 'redux';
import { StatsItem } from '../../veau-entity/StatsItem';
import { ACTION, Action, StatsEditSelectItemAction, StatsEditUpdateSelectingItemAction } from '../actions/Action';

export type StatsEdit = {
  selectingItem?: StatsItem;
  selectingRow: number;
};

const initialState: StatsEdit = {
  selectingItem: undefined,
  selectingRow: 0
};

export const statsEdit: Reducer<StatsEdit, Action> = (state: StatsEdit = initialState, action: Action): StatsEdit => {
  switch (action.type) {
    case ACTION.STATS_EDIT_SELECT_ITEM: {
      const {
        statsItem,
        row
      }: StatsEditSelectItemAction = action;

      return {
        ...state,
        selectingItem: statsItem,
        selectingRow: row
      };
    }
    case ACTION.STATS_EDIT_UPDATE_SELECTING_ITEM: {
      const {
        statsItem
      }: StatsEditUpdateSelectingItemAction = action;

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
