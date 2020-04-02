import { connect, ConnectedComponent, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { Action } from '../../actions/Action';
import { disappearNotification } from '../../actions/NotificationAction';
import { Notification as Component } from '../../components/molecules/Notification';
import { State } from '../../State';

type StateProps = {
  kind: 'info' | 'success' | 'warn' | 'error';
  open: boolean;
  horizontal: 'left' | 'center' | 'right';
  vertical: 'top' | 'bottom';
  message: string;
  duration: number;
  values?: {[key: string]: string};
};
type DispatchProps = {
  closeClicked: () => void;
};
type OwnProps = {
};
export type Props = StateProps & DispatchProps & OwnProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State) => {
  const {
    notification: {
      kind,
      open,
      horizontal,
      vertical,
      message,
      duration,
      values
    }
  } = state;

  return {
    kind,
    open,
    horizontal,
    vertical,
    message,
    duration,
    values
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch: Dispatch<Action>) => {
  return {
    closeClicked: () => {
      dispatch(disappearNotification());
    }
  };
};

export const Notification: ConnectedComponent<typeof Component, Pick<StateProps, never>> = connect<StateProps, DispatchProps, OwnProps, State>(mapStateToProps, mapDispatchToProps)(Component);
