import { connect, ConnectedComponent, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { Action } from '../../actions/Action';
import { openProvider } from '../../actions/PageProviderAction';
import { Authenticated as Component } from '../../components/templates/Authenticated';
import { State } from '../../State';

type StateProps = Readonly<{
}>;
type DispatchProps = Readonly<{
  menuClicked: () => void;
}>;
type OwnProps = Readonly<{
}>;
export type Props = StateProps & DispatchProps & OwnProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = () => {
  return {
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch: Dispatch<Action>) => {
  return {
    menuClicked: () => {
      dispatch(openProvider());
    }
  };
};

export const Authenticated: ConnectedComponent<typeof Component, Pick<StateProps, never>> = connect<StateProps, DispatchProps, OwnProps, State>(mapStateToProps, mapDispatchToProps)(Component);
