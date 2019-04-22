import { ACTION, Action } from '../actions/Action';

export type PageProvider = {
  open: boolean;
};

const initialState: PageProvider = {
  open: false
};

export const pageProvider: (state: PageProvider, action: Action) => PageProvider = (state: PageProvider = initialState, action: Action): PageProvider => {
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
