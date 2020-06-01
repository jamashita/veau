import { Reducer } from 'redux';

import { Stats } from '../../Entity/Stats/Stats';
import {
    STATS_LIST_CLOSE_STATS_MODAL, STATS_LIST_OPEN_STATS_MODAL, STATS_LIST_RESET_NEW_STATS,
    STATS_LIST_UPDATE_NEW_STATS, VeauAction
} from '../Action';

export type StatsList = Readonly<{
  open: boolean;
  stats: Stats;
}>;

const initialState: StatsList = {
  open: false,
  stats: Stats.default()
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
        stats: Stats.default()
      };
    }
    default: {
      return state;
    }
  }
};
