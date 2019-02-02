import { connect, ConnectedComponentClass, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { Action } from '../../../declarations/Action';
import { State } from '../../../declarations/State';
import { NotificationKind } from '../../../veau-enum/NotificationKind';
import { disappearNotification } from '../../actions/NotificationAction';
import { Notification as Component } from '../../components/molecules/Notification';

type StateProps = {
  kind: NotificationKind;
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

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State): StateProps => {
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

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch: Dispatch<Action>): DispatchProps => {
  return {
    closeClicked: (): void => {
      dispatch(disappearNotification());
    }
  };
};

export const Notification: ConnectedComponentClass<any, any> = connect(mapStateToProps, mapDispatchToProps)(Component);
