import {Modal} from '../../declarations/State';
import {ACTION, Action} from '../../declarations/Action';

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
        ...state, title: action.title, description: action.description, values: action.values, open: true
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
