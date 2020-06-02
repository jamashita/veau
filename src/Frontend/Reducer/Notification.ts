import { Reducer } from 'redux';

import {
  NOTIFICATION_APPEAR,
  NOTIFICATION_DISAPPEAR,
  NotificationHPosition,
  NotificationKind,
  NotificationVPosition,
  VeauAction
} from '../Action';

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

export const notification: Reducer<Notification, VeauAction> = (
  state: Notification = initialState,
  action: VeauAction
) => {
  switch (action.type) {
    case NOTIFICATION_APPEAR: {
      // prettier-ignore
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
