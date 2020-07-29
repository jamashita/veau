import { Stats } from '../../Entity/Stats/Stats';
import { StatsDisplay } from '../../VO/Display/StatsDisplay';
import { ISO639 } from '../../VO/Language/ISO639';
import { ISO3166 } from '../../VO/Region/ISO3166';
import { StatsListItems } from '../../VO/StatsListItem/StatsListItems';
import { StatsName } from '../../VO/StatsOutline/StatsName';
import { StatsUnit } from '../../VO/StatsOutline/StatsUnit';
import { Term } from '../../VO/Term/Term';
import {
  STATS_LIST_CLOSE_STATS_MODAL,
  STATS_LIST_INITIALIZE,
  STATS_LIST_ISO3166_SELECTED,
  STATS_LIST_ISO639_SELECTED,
  STATS_LIST_NAME_TYPED,
  STATS_LIST_OPEN_STATS_MODAL,
  STATS_LIST_RESET_STATS,
  STATS_LIST_RESET_STATS_DISPLAY,
  STATS_LIST_RESET_STATS_ITEMS,
  STATS_LIST_SAVE_STATS,
  STATS_LIST_TERM_SELECTED,
  STATS_LIST_UNIT_TYPED,
  STATS_LIST_UPDATE_STATS,
  STATS_LIST_UPDATE_STATS_DISPLAY,
  STATS_LIST_UPDATE_STATS_ITEMS,
  StatsListCloseNewStatsModalAction,
  StatsListInitializeAction,
  StatsListISO3166SelectedAction,
  StatsListISO639SelectedAction,
  StatsListNameTypedAction,
  StatsListOpenNewStatsModalAction,
  StatsListResetStatsAction,
  StatsListResetStatsDisplayAction,
  StatsListResetStatsItemsAction,
  StatsListSaveStatsAction,
  StatsListTermSelectedAction,
  StatsListUnitTypedAction,
  StatsListUpdateStatsAction,
  StatsListUpdateStatsDisplayAction,
  StatsListUpdateStatsItemsAction
} from '../Action';

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

export const updateNewStats = (stats: Stats): StatsListUpdateStatsAction => {
  return {
    type: STATS_LIST_UPDATE_STATS,
    stats
  };
};

export const resetNewStats = (): StatsListResetStatsAction => {
  return {
    type: STATS_LIST_RESET_STATS
  };
};

export const updateNewStatsDisplay = (display: StatsDisplay): StatsListUpdateStatsDisplayAction => {
  return {
    type: STATS_LIST_UPDATE_STATS_DISPLAY,
    display
  };
};

export const resetNewStatsDisplay = (): StatsListResetStatsDisplayAction => {
  return {
    type: STATS_LIST_RESET_STATS_DISPLAY
  };
};

export const saveNewStats = (): StatsListSaveStatsAction => {
  return {
    type: STATS_LIST_SAVE_STATS
  };
};

export const updateStatsListItems = (items: StatsListItems): StatsListUpdateStatsItemsAction => {
  return {
    type: STATS_LIST_UPDATE_STATS_ITEMS,
    items
  };
};

export const resetStatsListItems = (): StatsListResetStatsItemsAction => {
  return {
    type: STATS_LIST_RESET_STATS_ITEMS
  };
};
