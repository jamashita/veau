import { ACTION, CloseProviderAction, OpenProviderAction } from '../../declarations/Action';

export const openProvider: () => OpenProviderAction = (): OpenProviderAction => {
  return {
    type: ACTION.OPEN_PROVIDER
  };
};

export const closeProvider: () => CloseProviderAction = (): CloseProviderAction => {
  return {
    type: ACTION.CLOSE_PROVIDER
  };
};
