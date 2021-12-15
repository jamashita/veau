import { NOTHING, NothingAction } from '../Action';

export const nothing = (): NothingAction => {
  return {
    type: NOTHING
  };
};
