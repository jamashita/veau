import { connect, ConnectedComponent, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { Stats } from '../../../Entity/Stats';
import { ISO3166 } from '../../../VO/ISO3166';
import { ISO639 } from '../../../VO/ISO639';
import { Locale } from '../../../VO/Locale';
import { StatsID } from '../../../VO/StatsID';
import { StatsName } from '../../../VO/StatsName';
import { StatsOutlines } from '../../../VO/StatsOutlines';
import { StatsUnit } from '../../../VO/StatsUnit';
import { Term } from '../../../VO/Term';
import { Action } from '../../Action/Action';
import { pushToStatsEdit } from '../../Action/RedirectAction';
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
} from '../../Action/StatsListAction';
import { StatsList as Component } from '../../Component/pages/StatsList';
import { State } from '../../State';

type StateProps = Readonly<{
  statsOutlines: StatsOutlines;
  open: boolean;
  stats: Stats;
  locale: Locale;
}>;
type DispatchProps = Readonly<{
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
}>;
type OwnProps = Readonly<{}>;
export type Props = StateProps & DispatchProps & OwnProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State) => {
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

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch: Dispatch<Action>) => {
  return {
    initialize: () => {
      dispatch(initStatsList());
    },
    toStatsEdit: (statsID: StatsID) => {
      dispatch(pushToStatsEdit(statsID));
    },
    newStatsClicked: () => {
      dispatch(openNewStatsModal());
    },
    closeNewStatsModal: () => {
      dispatch(closeNewStatsModal());
    },
    nameTyped: (name: StatsName) => {
      dispatch(newStatsNameTyped(name));
    },
    unitTyped: (unit: StatsUnit) => {
      dispatch(newStatsUnitTyped(unit));
    },
    iso639Selected: (iso639: ISO639) => {
      dispatch(newStatsISO639Selected(iso639));
    },
    iso3166Selected: (iso3166: ISO3166) => {
      dispatch(newStatsISO3166Selected(iso3166));
    },
    termSelected: (term: Term) => {
      dispatch(newStatsTermSelected(term));
    },
    saveNewStats: () => {
      dispatch(saveNewStats());
    }
  };
};

export const StatsList: ConnectedComponent<typeof Component, Pick<StateProps, never>> = connect<StateProps, DispatchProps, OwnProps, State>(mapStateToProps, mapDispatchToProps)(Component);
