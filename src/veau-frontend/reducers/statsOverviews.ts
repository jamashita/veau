import { ACTION, Action } from '../../declarations/Action';
import { StatsOverview } from '../../veau-entity/StatsOverview';

const initialState: Array<StatsOverview> = [
];

export const statsOverviews: (stats: Array<StatsOverview>, action: Action) => Array<StatsOverview> = (state: Array<StatsOverview> = initialState, action: Action): Array<StatsOverview> => {
  switch (action.type) {
    case ACTION.STATS_OVERVIEW_UPDATE: {
      return action.statsOverviews;
    }
    default: {
      return state;
    }
  }
};
