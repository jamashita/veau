import { ACTION, Action } from '../../declarations/Action';

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
    case ACTION.OPEN_PROVIDER: {
      return {
        open: true
      };
    }
    case ACTION.CLOSE_PROVIDER: {
      return {
        open: false
      };
    }
    default: {
      return state;
    }
  }
};
