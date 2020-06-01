import { connect, ConnectedComponent, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';

import { VeauAction } from '../../Action/Action';
import { closeModal } from '../../Action/ModalAction';
import {
    DispatchProps, Modal as Component, OwnProps, StateProps
} from '../../Component/Molecule/Modal';
import { State } from '../../State';

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State) => {
  // prettier-ignore
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

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch: Dispatch<VeauAction>) => {
  return {
    closeClicked(): void {
      dispatch(closeModal());
    }
  };
};

export const Modal: ConnectedComponent<typeof Component, Pick<StateProps, never>> = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  State
>(
  mapStateToProps,
  mapDispatchToProps
)(Component);
