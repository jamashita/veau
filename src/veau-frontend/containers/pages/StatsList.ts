import { connect, ConnectedComponentClass, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { Action } from '../../../declarations/Action';
import { State } from '../../../declarations/State';
import { StatsOverview } from '../../../veau-entity/StatsOverview';
import { Language } from '../../../veau-vo/Language';
import { Region } from '../../../veau-vo/Region';
import { StatsID } from '../../../veau-vo/StatsID';
import { StatsList as Component } from '../../components/pages/StatsList';

type StateProps = {
  statsOverviews: Array<StatsOverview>;
  languages: Array<Language>;
  regions: Array<Region>;
};
type DispatchProps = {
  toEditStats(statsID: StatsID): void;
};
type OwnProps = {
};
export type Props = StateProps & DispatchProps & OwnProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State): StateProps => {
  const {
    statsOverviews,
    locales: {
      languages,
      regions
    }
  } = state;

  return {
    statsOverviews,
    languages,
    regions
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch: Dispatch<Action>): DispatchProps => {
  return {
    toEditStats: (statsID: StatsID): void => {
      console.log(statsID.toString());
    }
  };
};

export const StatsList: ConnectedComponentClass<any, any> = connect(mapStateToProps, mapDispatchToProps)(Component);
