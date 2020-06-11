import { ON_LOAD, OnLoadAction } from '../Action';

export const onload = (): OnLoadAction => {
  return {
    type: ON_LOAD
  };
};
