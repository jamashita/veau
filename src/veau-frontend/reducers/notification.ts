import { ACTION, Action } from '../../declarations/Action';
import { NotificationKind } from '../../veau-enum/NotificationKind';

export type Notification = {
  kind: NotificationKind;
  open: boolean;
  horizontal: 'left' | 'center' | 'right';
  vertical: 'top' | 'bottom';
  message: string;
  duration: number;
  values?: {[key: string]: string};
};

const initialState: Notification = {
  kind: NotificationKind.INFO,
  open: false,
  horizontal: 'center',
  vertical: 'top',
  duration: 3000,
  message: 'GREETING',
  values: undefined
};

export const notification: (state: Notification, action: Action) => Notification = (state: Notification = initialState, action: Action): Notification => {
  switch (action.type) {
    case ACTION.NOTIFICATION_APPEAR: {
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
    case ACTION.NOTIFICATION_DISAPPEAR: {
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
