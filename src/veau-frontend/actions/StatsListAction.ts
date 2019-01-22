import { ACTION, StatsListNewStatsAction } from '../../declarations/Action';

export const newStats: () => StatsListNewStatsAction = (): StatsListNewStatsAction => {
  return {
    type: ACTION.STATS_LIST_NEW_STATS
  };
};
