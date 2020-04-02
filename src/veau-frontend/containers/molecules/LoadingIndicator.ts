import { connect, ConnectedComponent, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { LoadingIndicator as Component } from '../../components/molecules/LoadingIndicator';
import { State } from '../../State';

type StateProps = {
  loadingCount: number;
};
type DispatchProps = {
};
type OwnProps = {
};
export type Props = StateProps & DispatchProps & OwnProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State) => {
  const {
    loadingCount
  } = state;

  return {
    loadingCount
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = () => {
  return {
  };
};

export const LoadingIndicator: ConnectedComponent<typeof Component, Pick<StateProps, never>> = connect<StateProps, DispatchProps, OwnProps, State>(mapStateToProps, mapDispatchToProps)(Component);
