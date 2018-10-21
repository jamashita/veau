import {
  connect,
  MapStateToProps,
  MapDispatchToProps,
} from 'react-redux';
import {Dispatch} from 'redux';
import {State} from '../../../declarations/State';
import {Action} from '../../../declarations/Action';
import Modal from '../../components/page/Modal';

type StateProps = {
  open: boolean;
  title: string;
  description: string;
  values?: {[key: string]: string};
};
type DispatchProps = {
  closeModalClicked: () => void;
};
export type Props = StateProps & DispatchProps;

const mapStateToProps: MapStateToProps<StateProps, {}, State> = (state) => {
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

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (dispatch: Dispatch<Action>) => {
  return {
    closeModalClicked: () => {
      // dispatch(closeModal());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
