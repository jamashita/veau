import {ACTION, PushToEntrancAction, PushToHomeAction} from '../../declarations/Action';

export const pushToHome: () => PushToHomeAction = (): PushToHomeAction => {
  return {
    type: ACTION.PUSH_TO_HOME
  };
};

export const pushToEntrance: () => PushToEntrancAction = (): PushToEntrancAction => {
  return {
    type: ACTION.PUSH_TO_ENTRANCE
  };
};
