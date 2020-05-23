import { Reducer } from 'redux';

import { EntranceInformation } from '../../VO/EntranceInformation/EntranceInformation';
import { Action, ENTRANCE_UPDATE, IDENTITY_IDENTIFIED } from '../Action/Action';

const initialState: EntranceInformation = EntranceInformation.empty();

export const entranceInformation: Reducer<EntranceInformation, Action> = (
  state: EntranceInformation = initialState,
  action: Action
) => {
  switch (action.type) {
    case IDENTITY_IDENTIFIED: {
      return EntranceInformation.empty();
    }
    case ENTRANCE_UPDATE: {
      return action.entranceInformation;
    }
    default: {
      return state;
    }
  }
};
