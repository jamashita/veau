import { StatsOutlines } from '../../veau-vo/collection/StatsOutlines';
import { Stats } from '../../veau-entity/Stats';
import { StatsItem } from '../../veau-entity/StatsItem';
import {
  ACTION,
  StatsItemResetAction,
  StatsItemUpdateAction,
  StatsOutlineResetAction,
  StatsOutlineUpdateAction,
  StatsResetAction,
  StatsUpdateAction
} from './Action';

export const updateStatsOutlines: (statsOutlines: StatsOutlines) => StatsOutlineUpdateAction = (statsOutlines: StatsOutlines): StatsOutlineUpdateAction => {
  return {
    type: ACTION.STATS_OUTLINE_UPDATE,
    statsOutlines
  };
};

export const resetStatsOutlines: () => StatsOutlineResetAction = (): StatsOutlineResetAction => {
  return {
    type: ACTION.STATS_OUTLINE_RESET
  };
};

export const updateStats: (stats: Stats) => StatsUpdateAction = (stats: Stats): StatsUpdateAction => {
  return {
    type: ACTION.STATS_UPDATE,
    stats
  };
};

export const resetStats: () => StatsResetAction = (): StatsResetAction => {
  return {
    type: ACTION.STATS_RESET
  };
};

export const updateStatsItem: (statsItem: StatsItem) => StatsItemUpdateAction = (statsItem: StatsItem): StatsItemUpdateAction => {
  return {
    type: ACTION.STATS_ITEM_UPDATE,
    statsItem
  };
};

export const resetStatsItem: () => StatsItemResetAction = (): StatsItemResetAction => {
  return {
    type: ACTION.STATS_ITEM_RESET
  };
};
