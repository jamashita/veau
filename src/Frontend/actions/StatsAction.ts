import { Stats } from '../../Entity/Stats';
import { StatsItem } from '../../Entity/StatsItem';
import { StatsOutlines } from '../../VO/StatsOutlines';
import {
  ACTION,
  StatsItemResetAction,
  StatsItemUpdateAction,
  StatsOutlineResetAction,
  StatsOutlineUpdateAction,
  StatsResetAction,
  StatsUpdateAction
} from './Action';

export const updateStatsOutlines = (statsOutlines: StatsOutlines): StatsOutlineUpdateAction => {
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

export const updateStats = (stats: Stats): StatsUpdateAction => {
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

export const updateStatsItem = (statsItem: StatsItem): StatsItemUpdateAction => {
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
