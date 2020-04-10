import { Reducer } from 'redux';
import { ACTION, Action } from '../actions/Action';

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
    case ACTION.LOCATION_CHANGE: {
      return {
        open: false
      };
    }
    case ACTION.PROVIDER_OPEN: {
      return {
        open: true
      };
    }
    case ACTION.PROVIDER_CLOSE: {
      return {
        open: false
      };
    }
    default: {
      return state;
    }
  }
};
