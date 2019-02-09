import { ACTION, LoadingFinishAction, LoadingStartAction } from './Action';

export const loading: () => LoadingStartAction = (): LoadingStartAction => {
  return {
    type: ACTION.LOADING_START
  };
};

export const loaded: () => LoadingFinishAction = (): LoadingFinishAction => {
  return {
    type: ACTION.LOADING_FINISH
  };
};
