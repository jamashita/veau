import { Reducer } from 'redux';

import { Stats } from '../../Entity/Stats/Stats';
import { Action, STATS_RESET, STATS_UPDATE } from '../Action/Action';

const initialState: Stats = Stats.default();

export const stats: Reducer<Stats, Action> = (state: Stats = initialState, action: Action) => {
  switch (action.type) {
    case STATS_UPDATE: {
      return action.stats;
    }
    case STATS_RESET: {
      return Stats.default();
    }
    default: {
      return state;
    }
  }
};
