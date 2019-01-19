import { ACTION, Action } from '../../declarations/Action';

export type LoadingCount = number;

export const loadingCount = (state: LoadingCount = 0, action: Action): LoadingCount => {
  switch (action.type) {
    case ACTION.LOADING_START: {
      return state + 1;
    }
    case ACTION.LOADING_FINISH: {
      return state - 1;
    }
    default: {
      return state;
    }
  }
};
