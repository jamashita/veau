import { Reducer } from 'redux';
import { LoadingCount } from '../../VO/LoadingCount';
import { ACTION, Action } from '../actions/Action';

const initialState: LoadingCount = LoadingCount.default();

export const loadingCount: Reducer<LoadingCount, Action> = (
  state: LoadingCount = initialState,
  action: Action
) => {
  switch (action.type) {
    case ACTION.LOADING_START: {
      return state.increment();
    }
    case ACTION.LOADING_FINISH: {
      return state.decrement();
    }
    default: {
      return state;
    }
  }
};
