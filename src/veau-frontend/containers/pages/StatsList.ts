import { connect, ConnectedComponentClass, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { Action } from '../../../declarations/Action';
import { State } from '../../../declarations/State';
import { StatsOverview } from '../../../veau-entity/StatsOverview';
import { LocaleRepository } from '../../../veau-repository/LocaleRepository';
import { StatsID } from '../../../veau-vo/StatsID';
import { pushToStatsEdit } from '../../actions/RedirectAction';
import { closeNewStatsModal, newStats } from '../../actions/StatsListAction';
import { StatsList as Component } from '../../components/pages/StatsList';

type StateProps = {
  statsOverviews: Array<StatsOverview>;
  localeRepository: LocaleRepository;
  open: boolean;
};
type DispatchProps = {
  toStatsEdit(statsID: StatsID): void;
  newStatsClicked(): void;
  closeNewStatsModal(): void;
};
type OwnProps = {
};
export type Props = StateProps & DispatchProps & OwnProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State): StateProps => {
  const {
    statsOverviews,
    localeRepository,
    statsList: {
      open
    }
  } = state;

  return {
    statsOverviews,
    localeRepository,
    open
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
    }
  };
};

export const StatsList: ConnectedComponentClass<any, any> = connect(mapStateToProps, mapDispatchToProps)(Component);
