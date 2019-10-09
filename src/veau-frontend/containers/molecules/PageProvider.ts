import { connect, ConnectedComponent, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { Action } from '../../actions/Action';
import { logout } from '../../actions/LogoutAction';
import { closeProvider } from '../../actions/PageProviderAction';
import { pushToStatsList } from '../../actions/RedirectAction';
import { PageProvider as Component } from '../../components/molecules/PageProvider';
import { State } from '../../State';

type StateProps = {
  open: boolean;
};
type DispatchProps = {
  close: () => void;
  toStatsList: () => void;
  logout: () => void;
};
type OwnProps = {
};
export type Props = StateProps & DispatchProps & OwnProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State): StateProps => {
  const {
    pageProvider: {
      open
    }
  } = state;

  return {
    open
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch: Dispatch<Action>): DispatchProps => {
  return {
    close: (): void => {
      dispatch(closeProvider());
    },
    toStatsList: (): void => {
      dispatch(pushToStatsList());
    },
    logout: (): void => {
      dispatch(logout());
    }
  };
};

export const PageProvider: ConnectedComponent<typeof Component, Pick<StateProps, never>> = connect<StateProps, DispatchProps, OwnProps, State>(mapStateToProps, mapDispatchToProps)(Component);
