import {ACTION, Action} from '../../declarations/Action';

export const loadingCount = (state: number = 0, action: Action): number => {
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
