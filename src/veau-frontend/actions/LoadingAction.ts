import { ACTION, LoadingFinishAction, LoadingStartAction } from './Action';

export const loading = (): LoadingStartAction => {
  return {
    type: ACTION.LOADING_START
  };
};

export const loaded = (): LoadingFinishAction => {
  return {
    type: ACTION.LOADING_FINISH
  };
};
