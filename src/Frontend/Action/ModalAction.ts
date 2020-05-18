import { MODAL_CLOSE, MODAL_RAISE, ModalCloseAction, ModalRaiseAction } from './Action';

export const raiseModal = (title: string, description: string, values?: Record<string, string>): ModalRaiseAction => {
  return {
    type: MODAL_RAISE,
    title,
    description,
    values
  };
};

export const closeModal = (): ModalCloseAction => {
  return {
    type: MODAL_CLOSE
  };
};
