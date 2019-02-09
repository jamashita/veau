import { StatsOverview } from '../../veau-entity/StatsOverview';
import { Term } from '../../veau-enum/Term';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import {
  ACTION,
  StatsListCloseNewStatsModalAction,
  StatsListISO3166SelectedAction,
  StatsListISO639SelectedAction,
  StatsListNameTypedAction,
  StatsListNewStatsAction,
  StatsListRenewStatsAction,
  StatsListResetNewStatsAction,
  StatsListSaveNewStatsAction,
  StatsListTermSelectedAction
} from './Action';

export const newStats: () => StatsListNewStatsAction = (): StatsListNewStatsAction => {
  return {
    type: ACTION.STATS_LIST_NEW_STATS
  };
};

export const closeNewStatsModal: () => StatsListCloseNewStatsModalAction = (): StatsListCloseNewStatsModalAction => {
  return {
    type: ACTION.STATS_LIST_CLOSE_STATS_MODAL
  };
};

export const newStatsNameTyped: (name: string) => StatsListNameTypedAction = (name: string): StatsListNameTypedAction => {
  return {
    type: ACTION.STATS_LIST_NAME_TYPED,
    name
  };
} ;

export const newStatsISO639Selected: (iso639: ISO639) => StatsListISO639SelectedAction = (iso639: ISO639): StatsListISO639SelectedAction => {
  return {
    type: ACTION.STATS_LIST_ISO639_SELECTED,
    iso639
  };
};

export const newStatsISO3166Selected: (iso3166: ISO3166) => StatsListISO3166SelectedAction = (iso3166: ISO3166): StatsListISO3166SelectedAction => {
  return {
    type: ACTION.STAts_LIST_ISO3166_SELECTED,
    iso3166
  };
};

export const newStatsTermSelected: (term: Term) => StatsListTermSelectedAction = (term: Term): StatsListTermSelectedAction => {
  return {
    type: ACTION.STATS_LIST_TERM_SELECTED,
    term
  };
};

export const renewStatsOverview: (newStatsOverview: StatsOverview) => StatsListRenewStatsAction = (newStatsOverview: StatsOverview): StatsListRenewStatsAction => {
  return {
    type: ACTION.STATS_LIST_RENEW_STATS,
    newStatsOverview
  };
};

export const saveNewStats: () => StatsListSaveNewStatsAction = (): StatsListSaveNewStatsAction => {
  return {
    type: ACTION.STATS_LIST_SAVE_NEW_STATS
  };
};

export const resetNewStats: () => StatsListResetNewStatsAction = (): StatsListResetNewStatsAction => {
  return {
    type: ACTION.STATS_LIST_RESET_NEW_STATS
  };
};
