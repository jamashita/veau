import { StatsID } from '@/veau-vo/StatsID';
import { ACTION, PushToEntranceAction, PushToStatsEditAction, PushToStatsListAction } from './Action';

export const pushToStatsList: () => PushToStatsListAction = (): PushToStatsListAction => {
  return {
    type: ACTION.PUSH_TO_STATS_LIST
  };
};

export const pushToStatsEdit: (statsID: StatsID) => PushToStatsEditAction = (statsID: StatsID): PushToStatsEditAction => {
  return {
    type: ACTION.PUSH_TO_STATS_EDIT,
    statsID
  };
};

export const pushToEntrance: () => PushToEntranceAction = (): PushToEntranceAction => {
  return {
    type: ACTION.PUSH_TO_ENTRANCE
  };
};
