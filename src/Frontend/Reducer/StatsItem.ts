import { Reducer } from 'redux';

import { StatsItem } from '../../Entity/StatsItem/StatsItem';
import { Action, STATS_ITEM_RESET, STATS_ITEM_UPDATE } from '../Action/Action';

const initialState: StatsItem = StatsItem.default();

export const statsItem: Reducer<StatsItem, Action> = (state: StatsItem = initialState, action: Action) => {
  switch (action.type) {
    case STATS_ITEM_UPDATE: {
      return action.statsItem;
    }
    case STATS_ITEM_RESET: {
      return StatsItem.default();
    }
    default: {
      return state;
    }
  }
};
