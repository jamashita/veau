import { connect, ConnectedComponent, MapDispatchToProps, MapStateToProps } from 'react-redux';

import {
    DispatchProps, LoadingIndicator as Component, OwnProps, StateProps
} from '../../Component/Molecule/LoadingIndicator';
import { State } from '../../State';

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State) => {
  // prettier-ignore
  const {
    loadingCount
  } = state;

  return {
    loadingCount
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = () => {
  return {};
};

export const LoadingIndicator: ConnectedComponent<typeof Component, Pick<StateProps, never>> = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  State
>(
  mapStateToProps,
  mapDispatchToProps
)(Component);
