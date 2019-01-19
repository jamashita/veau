import { RouterState } from 'connected-react-router';
import { Entrance } from '../veau-frontend/reducers/entrance';
import { Identity } from '../veau-frontend/reducers/identity';
import { LoadingCount } from '../veau-frontend/reducers/loadingCount';
import { Modal } from '../veau-frontend/reducers/modal';

export type State = {
  modal: Modal;
  loadingCount: LoadingCount;
  identity: Identity;
  entrance: Entrance;
  router: RouterState;
};
