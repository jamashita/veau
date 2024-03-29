import { Reducer } from 'redux';
import {
  NOTIFICATION_APPEAR,
  NOTIFICATION_DISAPPEAR,
  NotificationHPosition,
  NotificationKind,
  NotificationVPosition,
  VeauAction
} from '../Action';

const initialState: Notification = {
  kind: 'info',
  open: false,
  horizontal: 'center',
  vertical: 'top',
  duration: 3000,
  message: 'GREETING'
};

export type Notification = Readonly<{
  kind: NotificationKind;
  open: boolean;
  horizontal: NotificationHPosition;
  vertical: NotificationVPosition;
  message: string;
  duration: number;
  values?: { [key: string]: string; };
}>;

export const notification: Reducer<Notification, VeauAction> = (
  state: Notification = initialState,
  action: VeauAction
) => {
  switch (action.type) {
    case NOTIFICATION_APPEAR: {
      const {
        kind,
        horizontal,
        vertical,
        message,
        duration,
        values
      } = action;

      return {
        ...state,
        open: true,
        kind,
        horizontal,
        vertical,
        message,
        duration,
        values
      };
    }
    case NOTIFICATION_DISAPPEAR: {
      return {
        ...state,
        open: false
      };
    }
    default: {
      return state;
    }
  }
};
