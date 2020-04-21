import { Reducer } from 'redux';
import { LoadingCount } from '../../VO/LoadingCount';
import { Action, LOADING_FINISH, LOADING_START } from '../Action/Action';

const initialState: LoadingCount = LoadingCount.default();

export const loadingCount: Reducer<LoadingCount, Action> = (
  state: LoadingCount = initialState,
  action: Action
) => {
  switch (action.type) {
    case LOADING_START: {
      return state.increment();
    }
    case LOADING_FINISH: {
      return state.decrement();
    }
    default: {
      return state;
    }
  }
};
