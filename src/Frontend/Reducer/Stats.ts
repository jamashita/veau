import { Reducer } from 'redux';

import { Stats } from '../../Entity/Stats/Stats';
import { StatsDisplay } from '../../VO/Display/StatsDisplay';
import { STATS_RESET, STATS_UPDATE, VeauAction } from '../Action';

const initialState: StatsDisplay = Stats.default();

export const stats: Reducer<Stats, VeauAction> = (state: Stats = initialState, action: VeauAction) => {
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
