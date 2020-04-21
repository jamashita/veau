import { Stats } from '../../Entity/Stats';
import { ISO3166 } from '../../VO/ISO3166';
import { ISO639 } from '../../VO/ISO639';
import { StatsName } from '../../VO/StatsName';
import { StatsUnit } from '../../VO/StatsUnit';
import { Term } from '../../VO/Term';
import {
  STATS_LIST_CLOSE_STATS_MODAL,
  STATS_LIST_INITIALIZE,
  STATS_LIST_ISO3166_SELECTED,
  STATS_LIST_ISO639_SELECTED,
  STATS_LIST_NAME_TYPED,
  STATS_LIST_OPEN_STATS_MODAL,
  STATS_LIST_RESET_NEW_STATS,
  STATS_LIST_SAVE_NEW_STATS,
  STATS_LIST_TERM_SELECTED,
  STATS_LIST_UNIT_TYPED,
  STATS_LIST_UPDATE_NEW_STATS,
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

export const initStatsList = (): StatsListInitializeAction => {
  return {
    type: STATS_LIST_INITIALIZE
  };
};

export const openNewStatsModal = (): StatsListOpenNewStatsModalAction => {
  return {
    type: STATS_LIST_OPEN_STATS_MODAL
  };
};

export const closeNewStatsModal = (): StatsListCloseNewStatsModalAction => {
  return {
    type: STATS_LIST_CLOSE_STATS_MODAL
  };
};

export const newStatsNameTyped = (name: StatsName): StatsListNameTypedAction => {
  return {
    type: STATS_LIST_NAME_TYPED,
    name
  };
};

export const newStatsUnitTyped = (unit: StatsUnit): StatsListUnitTypedAction => {
  return {
    type: STATS_LIST_UNIT_TYPED,
    unit
  };
};

export const newStatsISO639Selected = (iso639: ISO639): StatsListISO639SelectedAction => {
  return {
    type: STATS_LIST_ISO639_SELECTED,
    iso639
  };
};

export const newStatsISO3166Selected = (iso3166: ISO3166): StatsListISO3166SelectedAction => {
  return {
    type: STATS_LIST_ISO3166_SELECTED,
    iso3166
  };
};

export const newStatsTermSelected = (term: Term): StatsListTermSelectedAction => {
  return {
    type: STATS_LIST_TERM_SELECTED,
    term
  };
};

export const updateNewStats = (stats: Stats): StatsListUpdateNewStatsAction => {
  return {
    type: STATS_LIST_UPDATE_NEW_STATS,
    stats
  };
};

export const saveNewStats = (): StatsListSaveNewStatsAction => {
  return {
    type: STATS_LIST_SAVE_NEW_STATS
  };
};

export const resetNewStats = (): StatsListResetNewStatsAction => {
  return {
    type: STATS_LIST_RESET_NEW_STATS
  };
};
