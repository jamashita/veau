import { Stats } from '../../veau-entity/Stats';
import { StatsItem } from '../../veau-entity/StatsItem';
import { StatsOverview } from '../../veau-entity/StatsOverview';
import {
  ACTION,
  StatsItemResetAction,
  StatsItemUpdateAction,
  StatsOverviewUpdateAction,
  StatsResetAction,
  StatsUpdateAction
} from './Action';

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

export const resetStats: () => StatsResetAction = (): StatsResetAction => {
  return {
    type: ACTION.STATS_RESET
  };
};

export const updateStatsItem: (statsItem: StatsItem) => StatsItemUpdateAction = (statsItem: StatsItem): StatsItemUpdateAction => {
  return {
    type: ACTION.STATS_ITEM_UPDATE,
    statsItem
  };
};

export const resetStatsItem: () => StatsItemResetAction = (): StatsItemResetAction => {
  return {
    type: ACTION.STATS_ITEM_RESET
  };
};
