import {
  connect, ConnectedComponentClass,
  MapDispatchToProps,
  MapStateToProps
} from 'react-redux';
import { Dispatch } from 'redux';
import { Action } from '../../../declarations/Action';
import { State } from '../../../declarations/State';
import { closeModal } from '../../actions/ModalAction';
import { Modal as Component } from '../../components/pages/Modal';

type StateProps = {
  open: boolean;
  title: string;
  description: string;
  values?: {[key: string]: string};
};
type DispatchProps = {
  closeClicked(): void;
};
type OwnProps = {
};
export type Props = StateProps & DispatchProps & OwnProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State): StateProps => {
  const {
    modal: {
      open,
      title,
      description,
      values
    }
  } = state;

  return {
    open,
    title,
    description,
    values
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch: Dispatch<Action>): DispatchProps => {
  return {
    closeClicked: (): void => {
      dispatch(closeModal());
    }
  };
};

export const Modal: ConnectedComponentClass<any, any> = connect(mapStateToProps, mapDispatchToProps)(Component);
