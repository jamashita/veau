import { connect, ConnectedComponent, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';

import { Action } from '../../Action/Action';
import { closeModal } from '../../Action/ModalAction';
import { Modal as Component } from '../../Component/Molecule/Modal';
import { State } from '../../State';

type StateProps = Readonly<{
  open: boolean;
  title: string;
  description: string;
  values?: Record<string, string>;
}>;
type DispatchProps = Readonly<{
  closeClicked(): void;
}>;
type OwnProps = Readonly<{}>;
export type Props = StateProps & DispatchProps & OwnProps;

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

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch: Dispatch<Action>) => {
  return {
    closeClicked: () => {
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
