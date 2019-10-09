import { connect, ConnectedComponent, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { VeauAccount } from '../../veau-entity/VeauAccount';
import { I18NProvider as Component } from '../components/I18NProvider';
import { State } from '../State';

type StateProps = {
  identity: VeauAccount;
};
type DispatchProps = {
};
type OwnProps = {
};
export type Props = StateProps & DispatchProps & OwnProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State): StateProps => {
  const {
    identity
  } = state;

  return {
    identity
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (): DispatchProps => {
  return {
  };
};

export const I18NProvider: ConnectedComponent<typeof Component, Pick<StateProps, never>> = connect<StateProps, DispatchProps, OwnProps, State>(mapStateToProps, mapDispatchToProps)(Component);
