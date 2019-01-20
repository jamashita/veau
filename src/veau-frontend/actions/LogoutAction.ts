import { ACTION, LogoutAction } from '../../declarations/Action';

export const logout: (language: string, locale: string) => LogoutAction = (language: string, locale: string): LogoutAction => {
  return {
    type: ACTION.LOGOUT,
    language,
    locale
  };
};
