import { Reducer } from 'redux';
import { StatsItem } from '../../Entity/StatsItem';
import { ACTION, Action } from '../Action/Action';

const initialState: StatsItem = StatsItem.default();

export const statsItem: Reducer<StatsItem, Action> = (
  state: StatsItem = initialState,
  action: Action
) => {
  switch (action.type) {
    case ACTION.STATS_ITEM_UPDATE: {
      return action.statsItem;
    }
    case ACTION.STATS_ITEM_RESET: {
      return StatsItem.default();
    }
    default: {
      return state;
    }
  }
};
