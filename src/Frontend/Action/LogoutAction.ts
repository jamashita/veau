import { LOGOUT, LogoutAction } from './Action';

export const logout = (): LogoutAction => {
  return {
    type: LOGOUT
  };
};
