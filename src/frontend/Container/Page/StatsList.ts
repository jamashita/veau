import { connect, ConnectedComponent, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { ISO639 } from '../../../domain/vo/Language/ISO639';
import { ISO3166 } from '../../../domain/vo/Region/ISO3166';
import { StatsID } from '../../../domain/vo/StatsOutline/StatsID';
import { StatsName } from '../../../domain/vo/StatsOutline/StatsName';
import { StatsUnit } from '../../../domain/vo/StatsOutline/StatsUnit';
import { Term } from '../../../domain/vo/Term/Term';
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
  const {
    statsList: {
      open,
      stats,
      items
    },
    locale
  } = state;

  return {
    items,
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

export const StatsList: ConnectedComponent<typeof Component, StateProps> = connect<StateProps, DispatchProps, OwnProps, State>(
  mapStateToProps,
  mapDispatchToProps
)(Component);
