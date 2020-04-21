import { Reducer } from 'redux';
import { StatsOutlines } from '../../VO/StatsOutlines';
import { Action, STATS_OUTLINE_RESET, STATS_OUTLINE_UPDATE } from '../Action/Action';

const initialState: StatsOutlines = StatsOutlines.empty();

export const statsOutlines: Reducer<StatsOutlines, Action> = (
  state: StatsOutlines = initialState,
  action: Action
) => {
  switch (action.type) {
    case STATS_OUTLINE_UPDATE: {
      return action.statsOutlines;
    }
    case STATS_OUTLINE_RESET: {
      return StatsOutlines.empty();
    }
    default: {
      return state;
    }
  }
};
