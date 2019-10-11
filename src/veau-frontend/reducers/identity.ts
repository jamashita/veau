import { Reducer } from 'redux';
import { VeauAccount } from '../../veau-vo/VeauAccount';
import { ACTION, Action } from '../actions/Action';

const initialState: VeauAccount = VeauAccount.default();

export const identity: Reducer<VeauAccount, Action> = (state: VeauAccount = initialState, action: Action): VeauAccount => {
  switch (action.type) {
    case ACTION.IDENTITY_AUTHENTICATED: {
      return action.identity;
    }
    default: {
      return state;
    }
  }
};
