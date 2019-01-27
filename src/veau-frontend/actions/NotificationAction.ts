import { ACTION, NotificationAppearAction, NotificationDisappearAction } from '../../declarations/Action';
import { NotificationKind } from '../../veau-enum/NotificationKind';

export const appearNotification: (kind: NotificationKind, horizontal: 'left' | 'center' | 'right', vertical: 'top' | 'bottom', message: string, duration?: number, values?: {[key: string]: string}) => NotificationAppearAction = (kind: NotificationKind, horizontal: 'left' | 'center' | 'right', vertical: 'top' | 'bottom', message: string, duration: number = 3000, values?: {[key: string]: string}): NotificationAppearAction => {
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
