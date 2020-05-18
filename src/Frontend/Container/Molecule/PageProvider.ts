import { connect, ConnectedComponent, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { PageProvider as Provider } from '../../../VO/PageProvider';
import { Action } from '../../Action/Action';
import { logout } from '../../Action/LogoutAction';
import { closeProvider } from '../../Action/PageProviderAction';
import { pushToStatsList } from '../../Action/RedirectAction';
import { PageProvider as Component } from '../../Component/Molecule/PageProvider';
import { State } from '../../State';

type StateProps = Readonly<{
  provider: Provider;
}>;

type DispatchProps = Readonly<{
  close: () => void;
  toStatsList: () => void;
  logout: () => void;
}>;
type OwnProps = Readonly<{}>;
export type Props = StateProps & DispatchProps & OwnProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State) => {
  // prettier-ignore
  const {
    pageProvider
  } = state;

  return {
    provider: pageProvider
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch: Dispatch<Action>) => {
  return {
    close: () => {
      dispatch(closeProvider());
    },
    toStatsList: () => {
      dispatch(pushToStatsList());
    },
    logout: () => {
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
