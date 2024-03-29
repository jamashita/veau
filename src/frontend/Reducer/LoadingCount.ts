import { Reducer } from 'redux';
import { LoadingCount } from '../../domain/vo/LoadingCount/LoadingCount';
import { LOADING_FINISH, LOADING_START, VeauAction } from '../Action';

const initialState: LoadingCount = LoadingCount.default();

export const loadingCount: Reducer<LoadingCount, VeauAction> = (
  state: LoadingCount = initialState,
  action: VeauAction
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
