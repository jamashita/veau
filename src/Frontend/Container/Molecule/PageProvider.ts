import { connect, ConnectedComponent, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';

import { VeauAction } from '../../Action';
import { logout } from '../../ActionCreator/LogoutAction';
import { closeProvider } from '../../ActionCreator/PageProviderAction';
import { pushToStatsList } from '../../ActionCreator/RedirectAction';
import {
    DispatchProps, OwnProps, PageProvider as Component, StateProps
} from '../../Component/Molecule/PageProvider';
import { State } from '../../State';

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State) => {
  // prettier-ignore
  const {
    pageProvider
  } = state;

  return {
    provider: pageProvider
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch: Dispatch<VeauAction>) => {
  return {
    close(): void {
      dispatch(closeProvider());
    },
    toStatsList(): void {
      dispatch(pushToStatsList());
    },
    logout(): void {
      dispatch(logout());
    }
  };
};

export const PageProvider: ConnectedComponent<typeof Component, Pick<StateProps, never>> = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  State
>(
  mapStateToProps,
  mapDispatchToProps
)(Component);
