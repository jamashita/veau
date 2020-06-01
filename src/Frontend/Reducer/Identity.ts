import { Reducer } from 'redux';

import { Identity } from '../../VO/Identity/Identity';
import { IDENTITY_AUTHENTICATED, VeauAction } from '../Action';

const initialState: Identity = Identity.empty();

export const identity: Reducer<Identity, VeauAction> = (state: Identity = initialState, action: VeauAction) => {
  switch (action.type) {
    case IDENTITY_AUTHENTICATED: {
      return action.identity;
    }
    default: {
      return state;
    }
  }
};
