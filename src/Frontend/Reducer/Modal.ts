import { Reducer } from 'redux';

import { MODAL_CLOSE, MODAL_RAISE, VeauAction } from '../Action';

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

export const modal: Reducer<Modal, VeauAction> = (state: Modal = initialState, action: VeauAction) => {
  switch (action.type) {
    case MODAL_RAISE: {
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
