import { ACTION, Action } from '../actions/Action';

export type Notification = {
  kind: 'info' | 'success' | 'warn' | 'error';
  open: boolean;
  horizontal: 'left' | 'center' | 'right';
  vertical: 'top' | 'bottom';
  message: string;
  duration: number;
  values?: {[key: string]: string};
};

const initialState: Notification = {
  kind: 'info',
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
