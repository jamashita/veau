import {Entrance} from '../../declarations/State';
import {ACTION, Action} from '../../declarations/Action';
import {Login} from '../../veau-vo/Login';

const initialState: Entrance = {
  login: Login.default()
};

export const entrance = (state: Entrance = initialState, action: Action): Entrance => {
  switch (action.type) {
    case ACTION.IDENTITY_IDENTIFIED: {
      return initialState;
    }
    case ACTION.ENTRANCE_LOGIN_INFO_UPDATE: {
      return {
        ...state,
        login: action.login
      };
    }
    default: {
      return state;
    }
  }
};
