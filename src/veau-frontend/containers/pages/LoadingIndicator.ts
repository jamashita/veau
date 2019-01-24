import { connect, ConnectedComponentClass, MapStateToProps } from 'react-redux';
import { State } from '../../../declarations/State';
import { LoadingIndicator as Component } from '../../components/pages/LoadingIndicator';

type StateProps = {
  loadingCount: number;
};
type DispatchProps = {
};
type OwnProps = {
};
export type Props = StateProps & DispatchProps & OwnProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State): StateProps => {
  const {
    loadingCount
  } = state;

  return {
    loadingCount
  };
};

export const LoadingIndicator: ConnectedComponentClass<any, any> = connect(mapStateToProps, null)(Component);
