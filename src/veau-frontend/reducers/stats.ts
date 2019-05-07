import { Stats } from '@/veau-entity/Stats';
import { ACTION, Action } from '../actions/Action';

const initialState: Stats = Stats.default();

export const stats: (state: Stats, action: Action) => Stats = (state: Stats = initialState, action: Action): Stats => {
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
