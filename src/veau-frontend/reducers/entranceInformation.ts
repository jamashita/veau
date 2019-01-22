import { ACTION, Action } from '../../declarations/Action';
import { EntranceInformation } from '../../veau-vo/EntranceInformation';

const initialState: EntranceInformation = EntranceInformation.default();

export const entranceInformation: (state: EntranceInformation, action: Action) => EntranceInformation = (state: EntranceInformation = initialState, action: Action): EntranceInformation => {
  switch (action.type) {
    case ACTION.IDENTITY_RENEWED: {
      return initialState;
    }
    case ACTION.ENTRANCE_LOGIN_INFO_UPDATE: {
      return action.entranceInformation;
    }
    default: {
      return state;
    }
  }
};
