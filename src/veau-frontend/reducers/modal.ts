import { Reducer } from 'redux';
import { ACTION, Action } from '../actions/Action';

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

export const modal: Reducer<Modal, Action> = (state: Modal = initialState, action: Action): Modal => {
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
