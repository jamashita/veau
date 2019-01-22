import { connect, ConnectedComponentClass, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { Action } from '../../../declarations/Action';
import { State } from '../../../declarations/State';
import { Stats } from '../../../veau-entity/Stats';
import { StatsEdit as Component } from '../../components/pages/StatsEdit';

type StateProps = {
  stats: Stats;
};
type DispatchProps = {
  dataFilled(row: number, col: number, value: number): void;
};
type OwnProps = {
};
export type Props = StateProps & DispatchProps & OwnProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State): StateProps => {
  const {
    stats
  } = state;

  return {
    stats
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch: Dispatch<Action>): DispatchProps => {
  return {
    dataFilled: (row: number, col: number, value: number): void => {
      console.log(`row ${row}, col ${col}, value ${value}`);
    }
  };
};

export const StatsEdit: ConnectedComponentClass<any, any> = connect(mapStateToProps, mapDispatchToProps)(Component);
