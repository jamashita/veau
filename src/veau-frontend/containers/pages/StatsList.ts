import { connect, ConnectedComponent, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { Stats } from '../../../veau-entity/Stats';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { ISO639 } from '../../../veau-vo/ISO639';
import { Locale } from '../../../veau-vo/Locale';
import { StatsID } from '../../../veau-vo/StatsID';
import { StatsName } from '../../../veau-vo/StatsName';
import { StatsOutlines } from '../../../veau-vo/StatsOutlines';
import { StatsUnit } from '../../../veau-vo/StatsUnit';
import { Term } from '../../../veau-vo/Term';
import { Action } from '../../actions/Action';
import { pushToStatsEdit } from '../../actions/RedirectAction';
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
} from '../../actions/StatsListAction';
import { StatsList as Component } from '../../components/pages/StatsList';
import { State } from '../../State';

type StateProps = {
  statsOutlines: StatsOutlines;
  open: boolean;
  stats: Stats;
  locale: Locale;
};
type DispatchProps = {
  initialize: () => void;
  toStatsEdit: (statsID: StatsID) => void;
  newStatsClicked: () => void;
  closeNewStatsModal: () => void;
  nameTyped: (name: StatsName) => void;
  unitTyped: (unit: StatsUnit) => void;
  iso639Selected: (iso639: ISO639) => void;
  iso3166Selected: (iso3166: ISO3166) => void;
  termSelected: (term: Term) => void;
  saveNewStats: () => void;
};
type OwnProps = {
};
export type Props = StateProps & DispatchProps & OwnProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State): StateProps => {
  const {
    statsOutlines,
    statsList: {
      open,
      stats
    },
    locale
  } = state;

  return {
    statsOutlines,
    open,
    stats,
    locale
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch: Dispatch<Action>): DispatchProps => {
  return {
    initialize: (): void => {
      dispatch(initStatsList());
    },
    toStatsEdit: (statsID: StatsID): void => {
      dispatch(pushToStatsEdit(statsID));
    },
    newStatsClicked: (): void => {
      dispatch(openNewStatsModal());
    },
    closeNewStatsModal: (): void => {
      dispatch(closeNewStatsModal());
    },
    nameTyped: (name: StatsName): void => {
      dispatch(newStatsNameTyped(name));
    },
    unitTyped: (unit: StatsUnit): void => {
      dispatch(newStatsUnitTyped(unit));
    },
    iso639Selected: (iso639: ISO639): void => {
      dispatch(newStatsISO639Selected(iso639));
    },
    iso3166Selected: (iso3166: ISO3166): void => {
      dispatch(newStatsISO3166Selected(iso3166));
    },
    termSelected: (term: Term): void => {
      dispatch(newStatsTermSelected(term));
    },
    saveNewStats: (): void => {
      dispatch(saveNewStats());
    }
  };
};

export const StatsList: ConnectedComponent<typeof Component, Pick<StateProps, never>> = connect<StateProps, DispatchProps, OwnProps, State>(mapStateToProps, mapDispatchToProps)(Component);
