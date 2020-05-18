import { Reducer } from 'redux';
import {
  Action,
  NOTIFICATION_APPEAR,
  NOTIFICATION_DISAPPEAR,
  NotificationHPosition,
  NotificationKind,
  NotificationVPosition
} from '../Action/Action';

export type Notification = Readonly<{
  kind: NotificationKind;
  open: boolean;
  horizontal: NotificationHPosition;
  vertical: NotificationVPosition;
  message: string;
  duration: number;
  values?: Record<string, string>;
}>;

const initialState: Notification = {
  kind: 'info',
  open: false,
  horizontal: 'center',
  vertical: 'top',
  duration: 3000,
  message: 'GREETING'
};

export const notification: Reducer<Notification, Action> = (state: Notification = initialState, action: Action) => {
  switch (action.type) {
    case NOTIFICATION_APPEAR: {
      const { kind, horizontal, vertical, message, duration, values } = action;

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
