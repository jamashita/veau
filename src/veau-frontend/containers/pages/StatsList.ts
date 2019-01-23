import { connect, ConnectedComponentClass, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { Action } from '../../../declarations/Action';
import { State } from '../../../declarations/State';
import { StatsOverview } from '../../../veau-entity/StatsOverview';
import { LocaleRepository } from '../../../veau-repository/LocaleRepository';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { ISO639 } from '../../../veau-vo/ISO639';
import { StatsID } from '../../../veau-vo/StatsID';
import { Term } from '../../../veau-vo/Term';
import { pushToStatsEdit } from '../../actions/RedirectAction';
import {
  closeNewStatsModal,
  newStats, newStatsISO3166Selected, newStatsISO639Selected,
  newStatsNameTyped,
  newStatsTermSelected
} from '../../actions/StatsListAction';
import { StatsList as Component } from '../../components/pages/StatsList';

type StateProps = {
  statsOverviews: Array<StatsOverview>;
  localeRepository: LocaleRepository;
  open: boolean;
  newStatsOverview: StatsOverview;
};
type DispatchProps = {
  toStatsEdit(statsID: StatsID): void;
  newStatsClicked(): void;
  closeNewStatsModal(): void;
  nameTyped(name: string): void;
  iso639Selected(iso639: ISO639): void;
  iso3166Selected(iso3166: ISO3166): void;
  termSelected(term: Term): void;
};
type OwnProps = {
};
export type Props = StateProps & DispatchProps & OwnProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State): StateProps => {
  const {
    statsOverviews,
    localeRepository,
    statsList: {
      open,
      newStatsOverview
    }
  } = state;

  return {
    statsOverviews,
    localeRepository,
    open,
    newStatsOverview
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch: Dispatch<Action>): DispatchProps => {
  return {
    toStatsEdit: (statsID: StatsID): void => {
      dispatch(pushToStatsEdit(statsID));
    },
    newStatsClicked: (): void => {
      dispatch(newStats());
    },
    closeNewStatsModal: (): void => {
      dispatch(closeNewStatsModal());
    },
    nameTyped: (name: string): void => {
      dispatch(newStatsNameTyped(name));
    },
    iso639Selected: (iso639: ISO639): void => {
      dispatch(newStatsISO639Selected(iso639));
    },
    iso3166Selected: (iso3166: ISO3166): void => {
      dispatch(newStatsISO3166Selected(iso3166));
    },
    termSelected: (term: Term): void => {
      dispatch(newStatsTermSelected(term));
    }
  };
};

export const StatsList: ConnectedComponentClass<any, any> = connect(mapStateToProps, mapDispatchToProps)(Component);
