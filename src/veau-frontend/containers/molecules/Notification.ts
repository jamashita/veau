import { connect, ConnectedComponent, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { Action, NotificationHPosition, NotificationKind, NotificationVPosition } from '../../actions/Action';
import { disappearNotification } from '../../actions/NotificationAction';
import { Notification as Component } from '../../components/molecules/Notification';
import { State } from '../../State';

type StateProps = Readonly<{
  kind: NotificationKind;
  open: boolean;
  horizontal: NotificationHPosition;
  vertical: NotificationVPosition;
  message: string;
  duration: number;
  values?: Record<string, string>;
}>;
type DispatchProps = Readonly<{
  closeClicked: () => void;
}>;
type OwnProps = Readonly<{
}>;
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
