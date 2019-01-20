import { ACTION, PushToEntranceAction, PushToStatsListAction } from '../../declarations/Action';

export const pushToStatsList: () => PushToStatsListAction = (): PushToStatsListAction => {
  return {
    type: ACTION.PUSH_TO_STATS_LIST
  };
};

export const pushToEntrance: () => PushToEntranceAction = (): PushToEntranceAction => {
  return {
    type: ACTION.PUSH_TO_ENTRANCE
  };
};
