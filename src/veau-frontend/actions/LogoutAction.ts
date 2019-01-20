import { ACTION, LogoutAction } from '../../declarations/Action';

export const logout: () => LogoutAction = (): LogoutAction => {
  return {
    type: ACTION.LOGOUT
  };
};
