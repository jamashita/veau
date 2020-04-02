import { Stats } from '../../veau-entity/Stats';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { StatsName } from '../../veau-vo/StatsName';
import { StatsUnit } from '../../veau-vo/StatsUnit';
import { Term } from '../../veau-vo/Term';
import {
  ACTION,
  StatsListCloseNewStatsModalAction,
  StatsListInitializeAction,
  StatsListISO3166SelectedAction,
  StatsListISO639SelectedAction,
  StatsListNameTypedAction,
  StatsListOpenNewStatsModalAction,
  StatsListResetNewStatsAction,
  StatsListSaveNewStatsAction,
  StatsListTermSelectedAction,
  StatsListUnitTypedAction,
  StatsListUpdateNewStatsAction
} from './Action';

export const initStatsList: () => StatsListInitializeAction = () => {
  return {
    type: ACTION.STATS_LIST_INITIALIZE
  };
};

export const openNewStatsModal: () => StatsListOpenNewStatsModalAction = () => {
  return {
    type: ACTION.STATS_LIST_OPEN_STATS_MODAL
  };
};

export const closeNewStatsModal: () => StatsListCloseNewStatsModalAction = () => {
  return {
    type: ACTION.STATS_LIST_CLOSE_STATS_MODAL
  };
};

export const newStatsNameTyped: (name: StatsName) => StatsListNameTypedAction = (name: StatsName) => {
  return {
    type: ACTION.STATS_LIST_NAME_TYPED,
    name
  };
};

export const newStatsUnitTyped: (unit: StatsUnit) => StatsListUnitTypedAction = (unit: StatsUnit) => {
  return {
    type: ACTION.STATS_LIST_UNIT_TYPED,
    unit
  };
};

export const newStatsISO639Selected: (iso639: ISO639) => StatsListISO639SelectedAction = (iso639: ISO639) => {
  return {
    type: ACTION.STATS_LIST_ISO639_SELECTED,
    iso639
  };
};

export const newStatsISO3166Selected: (iso3166: ISO3166) => StatsListISO3166SelectedAction = (iso3166: ISO3166) => {
  return {
    type: ACTION.STATS_LIST_ISO3166_SELECTED,
    iso3166
  };
};

export const newStatsTermSelected: (term: Term) => StatsListTermSelectedAction = (term: Term) => {
  return {
    type: ACTION.STATS_LIST_TERM_SELECTED,
    term
  };
};

export const updateNewStats: (stats: Stats) => StatsListUpdateNewStatsAction = (stats: Stats) => {
  return {
    type: ACTION.STATS_LIST_UPDATE_NEW_STATS,
    stats
  };
};

export const saveNewStats: () => StatsListSaveNewStatsAction = () => {
  return {
    type: ACTION.STATS_LIST_SAVE_NEW_STATS
  };
};

export const resetNewStats: () => StatsListResetNewStatsAction = () => {
  return {
    type: ACTION.STATS_LIST_RESET_NEW_STATS
  };
};
