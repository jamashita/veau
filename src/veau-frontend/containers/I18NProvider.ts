import { connect, ConnectedComponentClass, MapStateToProps } from 'react-redux';
import { State } from '../declarations/State';
import { VeauAccount } from '../../veau-entity/VeauAccount';
import { I18NProvider as Component } from '../components/I18NProvider';

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

export const I18NProvider: ConnectedComponentClass<any, any> = connect(mapStateToProps, null)(Component);
