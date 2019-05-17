import { Reducer } from 'redux';
import { ACTION, Action } from '../actions/Action';

export type LoadingCount = number;

const initialState: LoadingCount = 0;

export const loadingCount: Reducer<LoadingCount, Action> = (state: LoadingCount = initialState, action: Action): LoadingCount => {
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
