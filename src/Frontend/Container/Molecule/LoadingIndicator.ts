import { connect, ConnectedComponent, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { LoadingCount } from '../../../VO/LoadingCount';
import { LoadingIndicator as Component } from '../../Component/Molecule/LoadingIndicator';
import { State } from '../../State';

type StateProps = Readonly<{
  loadingCount: LoadingCount;
}>;
type DispatchProps = Readonly<{}>;
type OwnProps = Readonly<{}>;
export type Props = StateProps & DispatchProps & OwnProps;

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
