import {ACTION, PushToHomeAction} from '../../declarations/Action';

export const pushToHome = (): PushToHomeAction => {
  return {
    type: ACTION.PUSH_TO_HOME
  };
};
