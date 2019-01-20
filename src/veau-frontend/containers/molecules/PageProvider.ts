import { connect, ConnectedComponentClass, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { Action } from '../../../declarations/Action';
import { State } from '../../../declarations/State';
import { closeProvider } from '../../actions/PageProviderAction';
import { PageProvider as Component } from '../../components/molecules/PageProvider';

type StateProps = {
  isOpen: boolean;
};
type DispatchProps = {
  close(): void;
};
type OwnProps = {
};
export type Props = StateProps & DispatchProps & OwnProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State): StateProps => {
  const {
    pageProvider: {
      isOpen
    }
  } = state;

  return {
    isOpen
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch: Dispatch<Action>): DispatchProps => {
  return {
    close: (): void => {
      dispatch(closeProvider());
    }
  };
};

export const PageProvider: ConnectedComponentClass<any, any> = connect(mapStateToProps, mapDispatchToProps)(Component);
