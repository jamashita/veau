import { Stats } from '../../Entity/Stats';
import { StatsItem } from '../../Entity/StatsItem';
import { StatsOutlines } from '../../VO/StatsOutlines';
import {
  STATS_ITEM_RESET,
  STATS_ITEM_UPDATE,
  STATS_OUTLINE_RESET,
  STATS_OUTLINE_UPDATE,
  STATS_RESET,
  STATS_UPDATE,
  StatsItemResetAction,
  StatsItemUpdateAction,
  StatsOutlineResetAction,
  StatsOutlineUpdateAction,
  StatsResetAction,
  StatsUpdateAction
} from './Action';

export const updateStatsOutlines = (statsOutlines: StatsOutlines): StatsOutlineUpdateAction => {
  return {
    type: STATS_OUTLINE_UPDATE,
    statsOutlines
  };
};

export const resetStatsOutlines = (): StatsOutlineResetAction => {
  return {
    type: STATS_OUTLINE_RESET
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
