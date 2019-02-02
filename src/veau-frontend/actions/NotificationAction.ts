import { ACTION, NotificationAppearAction, NotificationDisappearAction } from '../../declarations/Action';

export const appearNotification: (kind: 'info' | 'success' | 'warn' | 'error', horizontal: 'left' | 'center' | 'right', vertical: 'top' | 'bottom', message: string, duration?: number, values?: {[key: string]: string}) => NotificationAppearAction = (kind: 'info' | 'success' | 'warn' | 'error', horizontal: 'left' | 'center' | 'right', vertical: 'top' | 'bottom', message: string, duration: number = 3000, values?: {[key: string]: string}): NotificationAppearAction => {
  return {
    type: ACTION.NOTIFICATION_APPEAR,
    kind,
    horizontal,
    vertical,
    message,
    duration,
    values
  };
};

export const disappearNotification: () => NotificationDisappearAction = (): NotificationDisappearAction => {
  return {
    type: ACTION.NOTIFICATION_DISAPPEAR
  };
};
