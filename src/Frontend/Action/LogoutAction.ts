import { ACTION, LogoutAction } from './Action';

export const logout = (): LogoutAction => {
  return {
    type: ACTION.LOGOUT
  };
};
