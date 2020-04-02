import { StatsID } from '../../veau-vo/StatsID';
import { ACTION, PushToEntranceAction, PushToStatsEditAction, PushToStatsListAction } from './Action';

export const pushToStatsList: () => PushToStatsListAction = () => {
  return {
    type: ACTION.PUSH_TO_STATS_LIST
  };
};

export const pushToStatsEdit: (statsID: StatsID) => PushToStatsEditAction = (statsID: StatsID) => {
  return {
    type: ACTION.PUSH_TO_STATS_EDIT,
    statsID
  };
};

export const pushToEntrance: () => PushToEntranceAction = () => {
  return {
    type: ACTION.PUSH_TO_ENTRANCE
  };
};
