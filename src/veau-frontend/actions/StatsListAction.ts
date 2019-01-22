import {ACTION, StatsListCloseNewStatsModalAction, StatsListNewStatsAction} from '../../declarations/Action';

export const newStats: () => StatsListNewStatsAction = (): StatsListNewStatsAction => {
  return {
    type: ACTION.STATS_LIST_NEW_STATS
  };
};

export const closeNewStatsModal: () => StatsListCloseNewStatsModalAction = (): StatsListCloseNewStatsModalAction => {
  return {
    type: ACTION.STATS_LIST_CLOSE_STATS_MODAL
  };
};
