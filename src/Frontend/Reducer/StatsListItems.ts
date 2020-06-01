import { Reducer } from 'redux';

import { StatsListItems } from '../../VO/StatsListItem/StatsListItems';
import { STATS_LIST_ITEM_RESET, STATS_LIST_ITEM_UPDATE, VeauAction } from '../Action/Action';

const initialState: StatsListItems = StatsListItems.empty();

export const statsListItems: Reducer<StatsListItems, VeauAction> = (
  state: StatsListItems = initialState,
  action: VeauAction
) => {
  switch (action.type) {
    case STATS_LIST_ITEM_UPDATE: {
      return action.statsListItems;
    }
    case STATS_LIST_ITEM_RESET: {
      return StatsListItems.empty();
    }
    default: {
      return state;
    }
  }
};
