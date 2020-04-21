import { Reducer } from 'redux';
import { Stats } from '../../Entity/Stats';
import { ACTION, Action } from '../Action/Action';

const initialState: Stats = Stats.default();

export const stats: Reducer<Stats, Action> = (
  state: Stats = initialState,
  action: Action
) => {
  switch (action.type) {
    case ACTION.STATS_UPDATE: {
      return action.stats;
    }
    case ACTION.STATS_RESET: {
      return Stats.default();
    }
    default: {
      return state;
    }
  }
};
