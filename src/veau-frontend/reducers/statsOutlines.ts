import { Reducer } from 'redux';
import { StatsOutlines } from '../../veau-entity/collection/StatsOutlines';
import { ACTION, Action } from '../actions/Action';

const initialState: StatsOutlines = StatsOutlines.from([]);

export const statsOutlines: Reducer<StatsOutlines, Action> = (state: StatsOutlines = initialState, action: Action): StatsOutlines => {
  switch (action.type) {
    case ACTION.STATS_OUTLINE_UPDATE: {
      return action.statsOutlines;
    }
    case ACTION.STATS_OUTLINE_RESET: {
      return StatsOutlines.from([]);
    }
    default: {
      return state;
    }
  }
};
