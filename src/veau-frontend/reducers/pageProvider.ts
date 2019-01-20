import {ACTION, Action} from '../../declarations/Action';

export type PageProvider = {
  isOpen: boolean;
};

const initialState: PageProvider = {
  isOpen: false
};

export const pageProvider: (state: PageProvider, action: Action) => PageProvider = (state: PageProvider = initialState, action: Action): PageProvider => {
  switch(action.type) {
    case ACTION.OPEN_PROVIDER: {
      return {
        isOpen: true;
      }
    }
    case ACTION.CLOSE_PROVIDER: {
      return {
        isOpen: false;
      };
    }
    default: {
      return state;
    }
  }
};
