import { LOADING_FINISH, LOADING_START, LoadingFinishAction, LoadingStartAction } from '../Action';

export const loading = (): LoadingStartAction => {
  return {
    type: LOADING_START
  };
};

export const loaded = (): LoadingFinishAction => {
  return {
    type: LOADING_FINISH
  };
};
