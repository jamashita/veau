import {
  NOTIFICATION_APPEAR,
  NOTIFICATION_DISAPPEAR,
  NotificationAppearAction,
  NotificationDisappearAction,
  NotificationHPosition,
  NotificationKind,
  NotificationVPosition
} from '../Action';

export const appearNotification = (
  kind: NotificationKind,
  horizontal: NotificationHPosition,
  vertical: NotificationVPosition,
  message: string,
  duration: number = 3000,
  values?: Record<string, string>
): NotificationAppearAction => {
  return {
    type: NOTIFICATION_APPEAR,
    kind,
    horizontal,
    vertical,
    message,
    duration,
    values
  };
};

export const disappearNotification = (): NotificationDisappearAction => {
  return {
    type: NOTIFICATION_DISAPPEAR
  };
};
