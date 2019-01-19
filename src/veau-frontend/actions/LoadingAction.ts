import { ACTION, LoadingFinishAction, LoadingStartAction } from '../../declarations/Action';

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
