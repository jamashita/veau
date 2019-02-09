import { StatsOverview } from '../../veau-entity/StatsOverview';
import { ACTION, Action } from '../actions/Action';

const initialState: Array<StatsOverview> = [
];

export const statsOverviews: (stats: Array<StatsOverview>, action: Action) => Array<StatsOverview> = (state: Array<StatsOverview> = initialState, action: Action): Array<StatsOverview> => {
  switch (action.type) {
    case ACTION.STATS_OVERVIEW_UPDATE: {
      return action.statsOverviews;
    }
    case ACTION.STATS_OVERVIEW_RESET: {
      return [
      ];
    }
    default: {
      return state;
    }
  }
};
