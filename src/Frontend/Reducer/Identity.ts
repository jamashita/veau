import { Reducer } from 'redux';

import { Identity } from '../../VO/Identity/Identity';
import { Action, IDENTITY_AUTHENTICATED } from '../Action/Action';

const initialState: Identity = Identity.empty();

export const identity: Reducer<Identity, Action> = (state: Identity = initialState, action: Action) => {
  switch (action.type) {
    case IDENTITY_AUTHENTICATED: {
      return action.identity;
    }
    default: {
      return state;
    }
  }
};
