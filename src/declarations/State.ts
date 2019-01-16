import {RouterState} from 'connected-react-router';
import {Entrance} from '../veau-frontend/reducers/entrance';
import {Identity} from '../veau-frontend/reducers/identity';
import {Modal} from '../veau-frontend/reducers/modal';

export type State = {
  modal: Modal;
  loadingCount: number;
  identity: Identity;
  entrance: Entrance;
  router: RouterState;
};
