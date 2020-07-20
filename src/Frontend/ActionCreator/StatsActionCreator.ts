import { Heisenberg } from '@jamashita/publikum-monad';
import { Stats } from '../../Entity/Stats/Stats';
import { StatsItem } from '../../Entity/StatsItem/StatsItem';
import { StatsDisplay } from '../../VO/Display/StatsDisplay';
import { StatsListItems } from '../../VO/StatsListItem/StatsListItems';
import {
  STATS_DISPLAY_RESET,
  STATS_DISPLAY_UPDATE,
  STATS_ITEM_RESET,
  STATS_ITEM_UPDATE,
  STATS_LIST_ITEM_RESET,
  STATS_LIST_ITEM_UPDATE,
  STATS_RESET,
  STATS_UPDATE,
  StatsDisplayResetAction,
  StatsDisplayUpdateAction,
  StatsItemResetAction,
  StatsItemUpdateAction,
  StatsListItemResetAction,
  StatsListItemUpdateAction,
  StatsResetAction,
  StatsUpdateAction
} from '../Action';

export const updateStatsListItems = (statsListItems: StatsListItems): StatsListItemUpdateAction => {
  return {
    type: STATS_LIST_ITEM_UPDATE,
    statsListItems
  };
};

export const resetStatsListItems = (): StatsListItemResetAction => {
  return {
    type: STATS_LIST_ITEM_RESET
  };
};

export const updateStats = (stats: Stats): StatsUpdateAction => {
  return {
    type: STATS_UPDATE,
    stats
  };
};

export const resetStats = (): StatsResetAction => {
  return {
    type: STATS_RESET
  };
};

export const updateStatsItem = (statsItem: StatsItem): StatsItemUpdateAction => {
  return {
    type: STATS_ITEM_UPDATE,
    statsItem
  };
};

export const resetStatsItem = (): StatsItemResetAction => {
  return {
    type: STATS_ITEM_RESET
  };
};

export const updateStatsDisplay = (display: Heisenberg<StatsDisplay>): StatsDisplayUpdateAction => {
  return {
    type: STATS_DISPLAY_UPDATE,
    display
  };
};

export const resetStatsDisplay = (): StatsDisplayResetAction => {
  return {
    type: STATS_DISPLAY_RESET
  };
};
