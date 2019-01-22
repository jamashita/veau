import { ACTION, Action } from '../../declarations/Action';
import { StatsOverview } from '../../veau-entity/StatsOverview';

export type StatsList = {
  open: boolean;
  newStats: StatsOverview;
};

const initialState: StatsList = {
  open: false,
  newStats: StatsOverview.default()
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
    case ACTION.STATS_LIST_RENEW_STATS: {
      return {
        ...state,
        newStats: action.newStatsOverview
      };
    }
    default: {
      return state;
    }
  }
};
