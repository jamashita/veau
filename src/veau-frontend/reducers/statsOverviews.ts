import { Stats } from '../../veau-entity/Stats';
import { ACTION, Action } from '../actions/Action';

const initialState: Array<Stats> = [
];

export const statsOverviews: (stats: Array<Stats>, action: Action) => Array<Stats> = (state: Array<Stats> = initialState, action: Action): Array<Stats> => {
  switch (action.type) {
    case ACTION.STATS_OVERVIEW_UPDATE: {
      return action.statsOverviews;
    }
    case ACTION.STATS_OVERVIEW_RESET: {
      return [
      ];
    }
    default: {
      return state;
    }
  }
};
