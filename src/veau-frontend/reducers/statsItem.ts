import { StatsItem } from '@/veau-entity/StatsItem';
import { ACTION, Action } from '../actions/Action';

const initialState: StatsItem = StatsItem.default();

export const statsItem: (state: StatsItem, action: Action) => StatsItem = (state: StatsItem = initialState, action: Action): StatsItem => {
  switch (action.type) {
    case ACTION.STATS_ITEM_UPDATE: {
      return action.statsItem;
    }
    case ACTION.STATS_ITEM_RESET: {
      return StatsItem.default();
    }
    default: {
      return state;
    }
  }
};
