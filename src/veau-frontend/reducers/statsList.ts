import { Reducer } from 'redux';
import { Stats } from '../../veau-entity/Stats';
import { ACTION, Action } from '../actions/Action';

export type StatsList = Readonly<{
  open: boolean;
  stats: Stats;
}>;

const initialState: StatsList = {
  open: false,
  stats: Stats.default()
};

export const statsList: Reducer<StatsList, Action> = (state: StatsList = initialState, action: Action) => {
  switch (action.type) {
    case ACTION.STATS_LIST_OPEN_STATS_MODAL: {
      return {
        ...state,
        open: true
      };
    }
    case ACTION.STATS_LIST_CLOSE_STATS_MODAL: {
      return {
        ...state,
        open: false
      };
    }
    case ACTION.STATS_LIST_UPDATE_NEW_STATS: {
      return {
        ...state,
        stats: action.stats
      };
    }
    case ACTION.STATS_LIST_RESET_NEW_STATS: {
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
