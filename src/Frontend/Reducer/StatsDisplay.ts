import { Absent, Heisenberg } from '@jamashita/publikum-monad';
import { Reducer } from 'redux';

import { StatsDisplay } from '../../VO/Display/StatsDisplay';
import { STATS_DISPLAY_RESET, STATS_DISPLAY_UPDATE, VeauAction } from '../Action';

const initialState: Heisenberg<StatsDisplay> = Absent.of<StatsDisplay>();

export const display: Reducer<Heisenberg<StatsDisplay>, VeauAction> = (
  state: Heisenberg<StatsDisplay> = initialState,
  action: VeauAction
) => {
  switch (action.type) {
    case STATS_DISPLAY_UPDATE: {
      return action.display;
    }
    case STATS_DISPLAY_RESET: {
      return Absent.of<StatsDisplay>();
    }
    default: {
      return state;
    }
  }
};
