import { ACTION, ProviderCloseAction, ProviderOpenAction } from './Action';

export const openProvider: () => ProviderOpenAction = (): ProviderOpenAction => {
  return {
    type: ACTION.PROVIDER_OPEN
  };
};

export const closeProvider: () => ProviderCloseAction = (): ProviderCloseAction => {
  return {
    type: ACTION.PROVIDER_CLOSE
  };
};
