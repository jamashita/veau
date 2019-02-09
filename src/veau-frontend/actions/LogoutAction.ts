import { ACTION, LogoutAction } from './Action';

export const logout: () => LogoutAction = (): LogoutAction => {
  return {
    type: ACTION.LOGOUT
  };
};
