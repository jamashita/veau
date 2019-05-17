import { Reducer } from 'redux';
import { EntranceInformation } from '../../veau-vo/EntranceInformation';
import { ACTION, Action } from '../actions/Action';

const initialState: EntranceInformation = EntranceInformation.default();

export const entranceInformation: Reducer<EntranceInformation, Action> = (state: EntranceInformation = initialState, action: Action): EntranceInformation => {
  switch (action.type) {
    case ACTION.IDENTITY_IDENTIFIED: {
      return EntranceInformation.default();
    }
    case ACTION.ENTRANCE_UPDATE: {
      return action.entranceInformation;
    }
    default: {
      return state;
    }
  }
};
