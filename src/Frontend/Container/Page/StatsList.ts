import { connect, ConnectedComponent, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';

import { ISO639 } from '../../../VO/Language/ISO639';
import { ISO3166 } from '../../../VO/Region/ISO3166';
import { StatsID } from '../../../VO/StatsOutline/StatsID';
import { StatsName } from '../../../VO/StatsOutline/StatsName';
import { StatsUnit } from '../../../VO/StatsOutline/StatsUnit';
import { Term } from '../../../VO/Term/Term';
import { VeauAction } from '../../Action';
import { pushToStatsEdit } from '../../ActionCreator/RedirectActionCreator';
import {
  closeNewStatsModal,
  initStatsList,
  newStatsISO3166Selected,
  newStatsISO639Selected,
  newStatsNameTyped,
  newStatsTermSelected,
  newStatsUnitTyped,
  openNewStatsModal,
  saveNewStats
} from '../../ActionCreator/StatsListActionCreator';
import { DispatchProps, OwnProps, StateProps, StatsList as Component } from '../../Component/Page/StatsList';
import { State } from '../../State';

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State) => {
  // prettier-ignore
  const {
    statsListItems,
    statsList: {
      open,
      stats
    },
    locale
  } = state;

  return {
    statsListItems,
    open,
    stats,
    locale
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch: Dispatch<VeauAction>) => {
  return {
    initialize(): void {
      dispatch(initStatsList());
    },
    toStatsEdit(statsID: StatsID): void {
      dispatch(pushToStatsEdit(statsID));
    },
    newStatsClicked(): void {
      dispatch(openNewStatsModal());
    },
    closeNewStatsModal(): void {
      dispatch(closeNewStatsModal());
    },
    nameTyped(name: StatsName): void {
      dispatch(newStatsNameTyped(name));
    },
    unitTyped(unit: StatsUnit): void {
      dispatch(newStatsUnitTyped(unit));
    },
    iso639Selected(iso639: ISO639): void {
      dispatch(newStatsISO639Selected(iso639));
    },
    iso3166Selected(iso3166: ISO3166): void {
      dispatch(newStatsISO3166Selected(iso3166));
    },
    termSelected(term: Term): void {
      dispatch(newStatsTermSelected(term));
    },
    saveNewStats(): void {
      dispatch(saveNewStats());
    }
  };
};

export const StatsList: ConnectedComponent<typeof Component, Pick<StateProps, never>> = connect<StateProps,
  DispatchProps,
  OwnProps,
  State>(
  mapStateToProps,
  mapDispatchToProps
)(Component);
