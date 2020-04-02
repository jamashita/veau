import { Stats } from '../../veau-entity/Stats';
import { StatsItem } from '../../veau-entity/StatsItem';
import { StatsOutlines } from '../../veau-vo/StatsOutlines';
import {
  ACTION,
  StatsItemResetAction,
  StatsItemUpdateAction,
  StatsOutlineResetAction,
  StatsOutlineUpdateAction,
  StatsResetAction,
  StatsUpdateAction
} from './Action';

export const updateStatsOutlines: (statsOutlines: StatsOutlines) => StatsOutlineUpdateAction = (statsOutlines: StatsOutlines) => {
  return {
    type: ACTION.STATS_OUTLINE_UPDATE,
    statsOutlines
  };
};

export const resetStatsOutlines: () => StatsOutlineResetAction = () => {
  return {
    type: ACTION.STATS_OUTLINE_RESET
  };
};

export const updateStats: (stats: Stats) => StatsUpdateAction = (stats: Stats) => {
  return {
    type: ACTION.STATS_UPDATE,
    stats
  };
};

export const resetStats: () => StatsResetAction = () => {
  return {
    type: ACTION.STATS_RESET
  };
};

export const updateStatsItem: (statsItem: StatsItem) => StatsItemUpdateAction = (statsItem: StatsItem) => {
  return {
    type: ACTION.STATS_ITEM_UPDATE,
    statsItem
  };
};

export const resetStatsItem: () => StatsItemResetAction = () => {
  return {
    type: ACTION.STATS_ITEM_RESET
  };
};
