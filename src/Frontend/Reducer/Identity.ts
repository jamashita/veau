import { Reducer } from 'redux';
import { VeauAccount } from '../../VO/VeauAccount';
import { Action, IDENTITY_AUTHENTICATED } from '../Action/Action';

const initialState: VeauAccount = VeauAccount.empty();

export const identity: Reducer<VeauAccount, Action> = (
  state: VeauAccount = initialState,
  action: Action
) => {
  switch (action.type) {
    case IDENTITY_AUTHENTICATED: {
      return action.identity;
    }
    default: {
      return state;
    }
  }
};
