import { StatsOutline } from '../../veau-entity/StatsOutline';
import { ACTION, Action } from '../actions/Action';

const initialState: Array<StatsOutline> = [
];

export const statsOutlines: (state: Array<StatsOutline>, action: Action) => Array<StatsOutline> = (state: Array<StatsOutline> = initialState, action: Action): Array<StatsOutline> => {
  switch (action.type) {
    case ACTION.STATS_OUTLINE_UPDATE: {
      return action.statsOutlines;
    }
    case ACTION.STATS_OUTLINE_RESET: {
      return [
      ];
    }
    default: {
      return state;
    }
  }
};
