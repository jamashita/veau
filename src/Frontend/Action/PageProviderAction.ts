import { PROVIDER_CLOSE, PROVIDER_OPEN, ProviderCloseAction, ProviderOpenAction } from '../Action';

export const openProvider = (): ProviderOpenAction => {
  return {
    type: PROVIDER_OPEN
  };
};

export const closeProvider = (): ProviderCloseAction => {
  return {
    type: PROVIDER_CLOSE
  };
};
