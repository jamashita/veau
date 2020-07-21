import { Absent, Heisenberg } from '@jamashita/publikum-monad';
import { Reducer } from 'redux';
import { Stats } from '../../Entity/Stats/Stats';
import { StatsDisplay } from '../../VO/Display/StatsDisplay';
import {
  STATS_LIST_CLOSE_STATS_MODAL,
  STATS_LIST_OPEN_STATS_MODAL,
  STATS_LIST_RESET_NEW_STATS,
  STATS_LIST_RESET_NEW_STATS_DISPLAY,
  STATS_LIST_UPDATE_NEW_STATS,
  STATS_LIST_UPDATE_NEW_STATS_DISPLAY,
  VeauAction
} from '../Action';

export type StatsList = Readonly<{
  open: boolean;
  stats: Stats;
  display: Heisenberg<StatsDisplay>;
}>;

const initialState: StatsList = {
  open: false,
  stats: Stats.default(),
  display: Absent.of<StatsDisplay>()
};

export const statsList: Reducer<StatsList, VeauAction> = (state: StatsList = initialState, action: VeauAction) => {
  switch (action.type) {
    case STATS_LIST_OPEN_STATS_MODAL: {
      return {
        ...state,
        open: true
      };
    }
    case STATS_LIST_CLOSE_STATS_MODAL: {
      return {
        ...state,
        open: false
      };
    }
    case STATS_LIST_UPDATE_NEW_STATS: {
      return {
        ...state,
        stats: action.stats
      };
    }
    case STATS_LIST_RESET_NEW_STATS: {
      return {
        ...state,
        stats: Stats.default(),
        display: Absent.of<StatsDisplay>()
      };
    }
    case STATS_LIST_UPDATE_NEW_STATS_DISPLAY: {
      return {
        ...state,
        display: action.display
      };
    }
    case STATS_LIST_RESET_NEW_STATS_DISPLAY: {
      return {
        ...state,
        display: Absent.of<StatsDisplay>()
      };
    }
    default: {
      return state;
    }
  }
};
