import { ACTION, StatsOverviewUpdateAction } from '../../declarations/Action';
import { StatsOverview } from '../../veau-entity/StatsOverview';

export const updateStatsOverviews: (statsOverviews: Array<StatsOverview>) => StatsOverviewUpdateAction = (statsOverviews: Array<StatsOverview>): StatsOverviewUpdateAction => {
  return {
    type: ACTION.STATS_OVERVIEW_UPDATE,
    statsOverviews
  };
};
