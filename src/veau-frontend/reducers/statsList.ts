import { ACTION, Action } from '../../declarations/Action';

export type StatsList = {
  open: boolean;
};

const initialState: StatsList = {
  open: false
};

export const statsList: (state: StatsList, action: Action) => StatsList = (state: StatsList = initialState, action: Action): StatsList => {
  switch (action.type) {
    case ACTION.STATS_LIST_NEW_STATS: {
      return {
        ...state,
        open: true
      };
    }
    case ACTION.STATS_LIST_CLOSE_STATS_MODAL: {
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
