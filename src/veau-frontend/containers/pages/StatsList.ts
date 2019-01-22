import { connect, ConnectedComponentClass, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { Action } from '../../../declarations/Action';
import { State } from '../../../declarations/State';
import { StatsOverview } from '../../../veau-entity/StatsOverview';
import { LocaleRepository } from '../../../veau-repository/LocaleRepository';
import { Language } from '../../../veau-vo/Language';
import { Region } from '../../../veau-vo/Region';
import { StatsID } from '../../../veau-vo/StatsID';
import { Term } from '../../../veau-vo/Term';
import { pushToStatsEdit } from '../../actions/RedirectAction';
import {
  closeNewStatsModal,
  newStats,
  newStatsLanguageSelected,
  newStatsNameTyped,
  newStatsRegionSelected, newStatsTermSelected
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
  languageSelected(language: Language): void;
  regionSelected(region: Region): void;
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
    languageSelected: (language: Language): void => {
      dispatch(newStatsLanguageSelected(language));
    },
    regionSelected: (region: Region): void => {
      dispatch(newStatsRegionSelected(region));
    },
    termSelected: (term: Term): void => {
      dispatch(newStatsTermSelected(term));
    }
  };
};

export const StatsList: ConnectedComponentClass<any, any> = connect(mapStateToProps, mapDispatchToProps)(Component);
