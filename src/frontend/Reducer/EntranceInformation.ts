import { Reducer } from 'react';
import { EntranceInformation } from '../../domain/vo/EntranceInformation/EntranceInformation';
import { ENTRANCE_ACCOUNT_NAME_TYPED, ENTRANCE_PASSWORD_TYPED, ENTRANCE_UPDATE, VeauAction } from '../Action';

const initialState: EntranceInformation = EntranceInformation.empty();

export const entranceInformation: Reducer<EntranceInformation, VeauAction> = (
  state: EntranceInformation,
  action: VeauAction
) => {
  switch (action.type) {
    case ENTRANCE_ACCOUNT_NAME_TYPED: {
      return EntranceInformation.of(action.account, state.getPassword());
    }
    case ENTRANCE_PASSWORD_TYPED: {
      return EntranceInformation.of(state.getAccount(), action.password);
    }
    case ENTRANCE_UPDATE: {
      return action.entranceInformation;
    }
    default: {
      return state;
    }
  }
};
