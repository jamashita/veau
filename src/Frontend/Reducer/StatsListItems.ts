import { Reducer } from 'redux';
import { StatsListItems } from '../../VO/StatsListItem/StatsListItems';
import { Action, STATS_LIST_ITEM_RESET, STATS_LIST_ITEM_UPDATE } from '../Action/Action';

const initialState: StatsListItems = StatsListItems.empty();

export const statsListItems: Reducer<StatsListItems, Action> = (
  state: StatsListItems = initialState,
  action: Action
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
