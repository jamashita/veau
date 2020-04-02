import { Reducer } from 'redux';
import { StatsOutlines } from '../../veau-vo/StatsOutlines';
import { ACTION, Action } from '../actions/Action';

const initialState: StatsOutlines = StatsOutlines.empty();

export const statsOutlines: Reducer<StatsOutlines, Action> = (state: StatsOutlines = initialState, action: Action) => {
  switch (action.type) {
    case ACTION.STATS_OUTLINE_UPDATE: {
      return action.statsOutlines;
    }
    case ACTION.STATS_OUTLINE_RESET: {
      return StatsOutlines.of([]);
    }
    default: {
      return state;
    }
  }
};
