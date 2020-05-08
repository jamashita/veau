import { Reducer } from 'redux';
import { StatsListItems } from '../../VO/StatsListItems';
import { Action, STATS_OUTLINE_RESET, STATS_OUTLINE_UPDATE } from '../Action/Action';

const initialState: StatsListItems = StatsListItems.empty();

export const statsListItems: Reducer<StatsListItems, Action> = (
  state: StatsListItems = initialState,
  action: Action
) => {
  switch (action.type) {
    case STATS_OUTLINE_UPDATE: {
      return action.statsListItems;
    }
    case STATS_OUTLINE_RESET: {
      return StatsListItems.empty();
    }
    default: {
      return state;
    }
  }
};
