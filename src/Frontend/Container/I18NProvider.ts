import { connect, ConnectedComponent, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Identity } from '../../VO/Identity';
import { I18NProvider as Component } from '../Component/I18NProvider';
import { State } from '../State';

type StateProps = Readonly<{
  identity: Identity;
}>;
type DispatchProps = Readonly<{}>;
type OwnProps = Readonly<{}>;
export type Props = StateProps & DispatchProps & OwnProps;

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

export const I18NProvider: ConnectedComponent<typeof Component, Pick<StateProps, never>> = connect<StateProps, DispatchProps, OwnProps, State>(
  mapStateToProps,
  mapDispatchToProps
)(Component);
