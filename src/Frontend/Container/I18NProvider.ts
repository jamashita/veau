import { connect, ConnectedComponent, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { DispatchProps, I18NProvider as Component, OwnProps, StateProps } from '../Component/I18NProvider';
import { State } from '../State';

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State) => {
  const {
    identity
  } = state;

  return {
    identity
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = () => {
  return {};
};

export const I18NProvider: ConnectedComponent<typeof Component, StateProps> = connect<StateProps, DispatchProps, OwnProps, State>(
  mapStateToProps,
  mapDispatchToProps
)(Component);
