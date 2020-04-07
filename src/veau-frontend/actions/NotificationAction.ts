import {
  ACTION,
  NotificationAppearAction,
  NotificationDisappearAction,
  NotificationHPosition,
  NotificationKind,
  NotificationVPosition
} from './Action';

export const appearNotification: (kind: NotificationKind,
  horizontal: NotificationHPosition,
  vertical: NotificationVPosition,
  message: string,
  duration?: number,
  values?: {[key: string]: string}) => NotificationAppearAction = (kind: NotificationKind,
  horizontal: NotificationHPosition,
  vertical: NotificationVPosition,
  message: string,
  duration: number = 3000,
  values?: {[key: string]: string}) => {
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

export const disappearNotification: () => NotificationDisappearAction = () => {
  return {
    type: ACTION.NOTIFICATION_DISAPPEAR
  };
};
