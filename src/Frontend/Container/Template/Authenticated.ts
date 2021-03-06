import { connect, ConnectedComponent, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { VeauAction } from '../../Action';
import { openProvider } from '../../ActionCreator/PageProviderActionCreator';
import {
  Authenticated as Component,
  DispatchProps,
  OwnProps,
  StateProps
} from '../../Component/Template/Authenticated';
import { State } from '../../State';

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = () => {
  return {};
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch: Dispatch<VeauAction>) => {
  return {
    menuClicked(): void {
      dispatch(openProvider());
    }
  };
};

export const Authenticated: ConnectedComponent<typeof Component, StateProps> = connect<StateProps, DispatchProps, OwnProps, State>(
  mapStateToProps,
  mapDispatchToProps
)(Component);
