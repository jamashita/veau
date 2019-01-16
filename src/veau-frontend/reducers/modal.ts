import {ACTION, Action} from '../../declarations/Action';

export type Modal = {
  open: boolean;
  title: string;
  description: string;
  values?: {[key: string]: string};
};

const initialState: Modal = {
  open: false,
  title: 'GREETING',
  description: 'GREETING',
  values: undefined
};

export const modal = (state: Modal = initialState, action: Action): Modal => {
  switch (action.type) {
    case ACTION.MODAL_RAISE: {
      return {
        ...state,
        title: action.title,
        description: action.description,
        values: action.values,
        open: true
      };
    }
    case ACTION.MODAL_CLOSE: {
      return {
        ...state, open: false
      };
    }
    default: {
      return state;
    }
  }
};
