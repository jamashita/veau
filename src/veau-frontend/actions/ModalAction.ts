import { ACTION, ModalCloseAction, ModalRaiseAction } from '../../declarations/Action';

export const raiseModal: (title: string, description: string, values?: {[key: string]: string}) => ModalRaiseAction = (title: string, description: string, values?: {[key: string]: string}): ModalRaiseAction => {
  return {
    type: ACTION.MODAL_RAISE,
    title,
    description,
    values
  };
};

export const closeModal: () => ModalCloseAction = (): ModalCloseAction => {
  return {
    type: ACTION.MODAL_CLOSE
  };
};
