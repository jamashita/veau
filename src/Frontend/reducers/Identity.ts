import { Reducer } from 'redux';
import { VeauAccount } from '../../VO/VeauAccount';
import { ACTION, Action } from '../Action/Action';

const initialState: VeauAccount = VeauAccount.empty();

export const identity: Reducer<VeauAccount, Action> = (
  state: VeauAccount = initialState,
  action: Action
) => {
  switch (action.type) {
    case ACTION.IDENTITY_AUTHENTICATED: {
      return action.identity;
    }
    default: {
      return state;
    }
  }
};
