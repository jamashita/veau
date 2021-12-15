import { StatsID } from '../../domain/vo/StatsOutline/StatsID';
import {
  PUSH_TO_ENTRANCE,
  PUSH_TO_STATS_EDIT,
  PUSH_TO_STATS_LIST,
  PushToEntranceAction,
  PushToStatsEditAction,
  PushToStatsListAction
} from '../Action';

export const pushToStatsList = (): PushToStatsListAction => {
  return {
    type: PUSH_TO_STATS_LIST
  };
};

export const pushToStatsEdit = (statsID: StatsID): PushToStatsEditAction => {
  return {
    type: PUSH_TO_STATS_EDIT,
    statsID
  };
};

export const pushToEntrance = (): PushToEntranceAction => {
  return {
    type: PUSH_TO_ENTRANCE
  };
};
