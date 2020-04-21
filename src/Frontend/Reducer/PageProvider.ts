import { Reducer } from 'redux';
import { Action, LOCATION_CHANGE, PROVIDER_CLOSE, PROVIDER_OPEN } from '../Action/Action';

export type PageProvider = Readonly<{
  open: boolean;
}>;

const initialState: PageProvider = {
  open: false
};

export const pageProvider: Reducer<PageProvider, Action> = (
  state: PageProvider = initialState,
  action: Action
) => {
  switch (action.type) {
    case LOCATION_CHANGE: {
      return {
        open: false
      };
    }
    case PROVIDER_OPEN: {
      return {
        open: true
      };
    }
    case PROVIDER_CLOSE: {
      return {
        open: false
      };
    }
    default: {
      return state;
    }
  }
};
