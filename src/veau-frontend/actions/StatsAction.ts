import { ACTION, StatsOverviewUpdateAction, StatsUpdateAction } from '../../declarations/Action';
import { Stats } from '../../veau-entity/Stats';
import { StatsOverview } from '../../veau-entity/StatsOverview';

export const updateStatsOverviews: (statsOverviews: Array<StatsOverview>) => StatsOverviewUpdateAction = (statsOverviews: Array<StatsOverview>): StatsOverviewUpdateAction => {
  return {
    type: ACTION.STATS_OVERVIEW_UPDATE,
    statsOverviews
  };
};

export const updateStats: (stats: Stats) => StatsUpdateAction = (stats: Stats): StatsUpdateAction => {
  return {
    type: ACTION.STATS_UPDATE,
    stats
  };
};
