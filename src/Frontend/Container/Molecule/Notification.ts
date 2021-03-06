import { connect, ConnectedComponent, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { VeauAction } from '../../Action';
import { disappearNotification } from '../../ActionCreator/NotificationActionCreator';
import { DispatchProps, Notification as Component, OwnProps, StateProps } from '../../Component/Molecule/Notification';
import { State } from '../../State';

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

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch: Dispatch<VeauAction>) => {
  return {
    closeClicked(): void {
      dispatch(disappearNotification());
    }
  };
};

export const Notification: ConnectedComponent<typeof Component, StateProps> = connect<StateProps, DispatchProps, OwnProps, State>(
  mapStateToProps,
  mapDispatchToProps
)(Component);
