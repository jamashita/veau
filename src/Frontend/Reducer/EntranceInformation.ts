import { Reducer } from 'redux';

import { EntranceInformation } from '../../VO/EntranceInformation/EntranceInformation';
import { ENTRANCE_UPDATE, IDENTITY_IDENTIFIED, VeauAction } from '../Action/Action';

const initialState: EntranceInformation = EntranceInformation.empty();

export const entranceInformation: Reducer<EntranceInformation, VeauAction> = (
  state: EntranceInformation = initialState,
  action: VeauAction
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
