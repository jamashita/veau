import { Reducer } from 'redux';
import { EntranceInformation } from '../../VO/EntranceInformation';
import { ACTION, Action } from '../Action/Action';

const initialState: EntranceInformation = EntranceInformation.empty();

export const entranceInformation: Reducer<EntranceInformation, Action> = (
  state: EntranceInformation = initialState,
  action: Action
) => {
  switch (action.type) {
    case ACTION.IDENTITY_IDENTIFIED: {
      return EntranceInformation.empty();
    }
    case ACTION.ENTRANCE_UPDATE: {
      return action.entranceInformation;
    }
    default: {
      return state;
    }
  }
};
