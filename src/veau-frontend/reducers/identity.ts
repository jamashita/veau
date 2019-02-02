import { ACTION, Action } from '../../declarations/Action';
import { VeauAccount } from '../../veau-entity/VeauAccount';

const initialState: VeauAccount = VeauAccount.default();

export const identity: (state: VeauAccount, action: Action) => VeauAccount = (state: VeauAccount = initialState, action: Action): VeauAccount => {
  switch (action.type) {
    case ACTION.IDENTITY_AUTHENTICATED: {
      return action.identity;
    }
    default: {
      return state;
    }
  }
};
