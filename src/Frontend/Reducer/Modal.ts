import { Reducer } from 'redux';

import { Action, MODAL_CLOSE, MODAL_RAISE } from '../Action/Action';

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

export const modal: Reducer<Modal, Action> = (state: Modal = initialState, action: Action) => {
  switch (action.type) {
    case MODAL_RAISE: {
      // prettier-ignore
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
    case MODAL_CLOSE: {
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
