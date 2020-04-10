import { Reducer } from 'redux';
import { ACTION, Action } from '../actions/Action';

export type Modal = Readonly<{
  open: boolean;
  title: string;
  description: string;
  values?: Record<string, string>;
}>;

const initialState: Modal = {
  open: false,
  title: 'GREETING',
  description: 'GREETING'
};

export const modal: Reducer<Modal, Action> = (
  state: Modal = initialState,
  action: Action
) => {
  switch (action.type) {
    case ACTION.MODAL_RAISE: {
      const {
        title,
        description,
        values
      } = action;

      return {
        ...state,
        title,
        description,
        values,
        open: true
      };
    }
    case ACTION.MODAL_CLOSE: {
      return {
        ...state,
        open: false
      };
    }
    default: {
      return state;
    }
  }
};
