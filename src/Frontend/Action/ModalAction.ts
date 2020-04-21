import { ACTION, ModalCloseAction, ModalRaiseAction } from './Action';

export const raiseModal = (
  title: string,
  description: string,
  values?: Record<string, string>
): ModalRaiseAction => {
  return {
    type: ACTION.MODAL_RAISE,
    title,
    description,
    values
  };
};

export const closeModal = (): ModalCloseAction => {
  return {
    type: ACTION.MODAL_CLOSE
  };
};
