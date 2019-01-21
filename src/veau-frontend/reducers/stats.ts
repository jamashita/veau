import { ACTION, Action } from '../../declarations/Action';
import { Stats } from '../../veau-entity/Stats';

const initialState: Stats = Stats.default();

export const stats: (state: Stats, action: Action) => Stats = (state: Stats = initialState, action: Action): Stats => {
  switch (action.type) {
    case ACTION.STATS_UPDATE: {
      return action.stats;
    }
    default: {
      return state;
    }
  }
};
