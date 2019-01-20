import { ACTION, Action } from '../../declarations/Action';
import {Identity} from '../../veau-vo/Identity';

const initialState: Identity = Identity.default();

export const identity: (state: Identity, action: Action) => Identity = (state: Identity = initialState, action: Action): Identity => {
  switch (action.type) {
    case ACTION.IDENTITY_RENEWED: {
      return action.identity;
    }
    default: {
      return state;
    }
  }
};
