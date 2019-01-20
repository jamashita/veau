import { connect, ConnectedComponentClass, MapStateToProps } from 'react-redux';
import { State } from '../../declarations/State';
import {Identity} from '../../veau-vo/Identity';
import { I18NProvider as Component } from '../components/I18NProvider';

type StateProps = {
  identity: Identity;
};
type OwnProps = {
};
export type Props = StateProps & OwnProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State): StateProps => {
  const {
    identity
  } = state;

  return {
    identity
  };
};

export const I18NProvider: ConnectedComponentClass<any, any> = connect(mapStateToProps, null)(Component);
