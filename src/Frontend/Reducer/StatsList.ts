import { Reducer } from 'redux';
import { Stats } from '../../Entity/Stats/Stats';
import { StatsDisplay } from '../../VO/Display/StatsDisplay';
import { StatsListItems } from '../../VO/StatsListItem/StatsListItems';
import {
  STATS_LIST_CLOSE_STATS_MODAL,
  STATS_LIST_OPEN_STATS_MODAL,
  STATS_LIST_RESET_STATS,
  STATS_LIST_RESET_STATS_DISPLAY,
  STATS_LIST_RESET_STATS_ITEMS,
  STATS_LIST_UPDATE_STATS,
  STATS_LIST_UPDATE_STATS_DISPLAY,
  STATS_LIST_UPDATE_STATS_ITEMS,
  VeauAction
} from '../Action';

const initialState: StatsList = {
  open: false,
  stats: Stats.default(),
  display: StatsDisplay.default(),
  items: StatsListItems.empty()
};

export type StatsList = Readonly<{
  open: boolean;
  stats: Stats;
  display: StatsDisplay;
  items: StatsListItems;
}>;

export const statsList: Reducer<StatsList, VeauAction> = (
  state: StatsList = initialState,
  action: VeauAction
) => {
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
    case STATS_LIST_UPDATE_STATS: {
      return {
        ...state,
        stats: action.stats
      };
    }
    case STATS_LIST_RESET_STATS: {
      return {
        ...state,
        stats: Stats.default()
      };
    }
    case STATS_LIST_UPDATE_STATS_DISPLAY: {
      return {
        ...state,
        display: action.display
      };
    }
    case STATS_LIST_RESET_STATS_DISPLAY: {
      return {
        ...state,
        display: StatsDisplay.default()
      };
    }
    case STATS_LIST_UPDATE_STATS_ITEMS: {
      return {
        ...state,
        items: action.items
      };
    }
    case STATS_LIST_RESET_STATS_ITEMS: {
      return {
        ...state,
        items: StatsListItems.empty()
      };
    }
    default: {
      return state;
    }
  }
};
