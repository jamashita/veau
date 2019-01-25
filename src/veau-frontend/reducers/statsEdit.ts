import { ACTION, Action } from '../../declarations/Action';

export type StatsEdit = {
  open: boolean;
};

const initialState: StatsEdit = {
  open: false
};

export const statsEdit: (state: StatsEdit, action: Action) => StatsEdit = (state: StatsEdit = initialState, action: Action): StatsEdit => {
  switch (action.type) {
    case ACTION.STATS_EDIT_NEW_ITEM: {
      return {
        ...state,
        open: true
      };
    }
    case ACTION.STATS_EDIT_CLOSE_ITEM_MODAL: {
      return {
        ...state,
        open: false
      };
    }
    default: {
      return state;
    }
  }
};
