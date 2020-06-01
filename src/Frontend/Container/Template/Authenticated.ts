import { connect, ConnectedComponent, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';

import { VeauAction } from '../../Action/Action';
import { openProvider } from '../../Action/PageProviderAction';
import {
    Authenticated as Component, DispatchProps, OwnProps, StateProps
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

export const Authenticated: ConnectedComponent<typeof Component, Pick<StateProps, never>> = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  State
>(
  mapStateToProps,
  mapDispatchToProps
)(Component);
