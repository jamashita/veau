import { connect, ConnectedComponentClass, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { Action } from '../../actions/Action';
import { openProvider } from '../../actions/PageProviderAction';
import { Authenticated as Component } from '../../components/templates/Authenticated';
import { State } from '../../State';

type StateProps = {
};
type DispatchProps = {
  menuClicked: () => void;
};
type OwnProps = {
};
export type Props = StateProps & DispatchProps & OwnProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State): StateProps => {
  return {
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch: Dispatch<Action>): DispatchProps => {
  return {
    menuClicked: (): void => {
      dispatch(openProvider());
    }
  };
};

export const Authenticated: ConnectedComponentClass<any, any> = connect(mapStateToProps, mapDispatchToProps)(Component);
