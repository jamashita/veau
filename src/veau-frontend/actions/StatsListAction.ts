import {
  ACTION,
  StatsListCloseNewStatsModalAction,
  StatsListLanguageSelectedAction,
  StatsListNameTypedAction,
  StatsListNewStatsAction,
  StatsListRegionSelectedAction,
  StatsListRenewStatsAction,
  StatsListTermSelectedAction
} from '../../declarations/Action';
import { StatsOverview } from '../../veau-entity/StatsOverview';
import { Language } from '../../veau-vo/Language';
import { Region } from '../../veau-vo/Region';
import { Term } from '../../veau-vo/Term';

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

export const newStatsLanguageSelected: (language: Language) => StatsListLanguageSelectedAction = (language: Language): StatsListLanguageSelectedAction => {
  return {
    type: ACTION.STATS_LIST_LANGUAGE_SELECTED,
    language
  };
};

export const newStatsRegionSelected: (region: Region) => StatsListRegionSelectedAction = (region: Region): StatsListRegionSelectedAction => {
  return {
    type: ACTION.STATS_LIST_REGION_SELECTED,
    region
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
