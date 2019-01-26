import { ACTION, Action } from '../../declarations/Action';
import { StatsItem } from '../../veau-entity/StatsItem';

export type StatsEdit = {
  selectingItem?: StatsItem;
  selectingRow: number;
  openSaveSuccessSnackbar: boolean;
};

const initialState: StatsEdit = {
  selectingItem: undefined,
  selectingRow: 0,
  openSaveSuccessSnackbar: false
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
    case ACTION.STATS_EDIT_CLEAR_SELECTING_ITEM: {
      return {
        ...state,
        selectingItem: undefined
      };
    }
    case ACTION.STATS_EDIT_SAVE_SUCCESS: {
      return {
        ...state,
        openSaveSuccessSnackbar: true
      };
    }
    case ACTION.STATS_EDIT_CLOSE_SAVE_SNACKBAR: {
      return {
        ...state,
        openSaveSuccessSnackbar: false
      };
    }
    default: {
      return state;
    }
  }
};
