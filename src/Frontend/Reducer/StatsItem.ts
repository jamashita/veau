import { Reducer } from 'redux';

import { StatsItem } from '../../Entity/StatsItem/StatsItem';
import { STATS_ITEM_RESET, STATS_ITEM_UPDATE, VeauAction } from '../Action';

const initialState: StatsItem = StatsItem.default();

export const statsItem: Reducer<StatsItem, VeauAction> = (state: StatsItem = initialState, action: VeauAction) => {
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
