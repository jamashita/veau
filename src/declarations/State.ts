import {Login} from '../veau-domain/Login';

export type Modal = {
  open: boolean;
  title: string;
  description: string;
  values?: {[key: string]: string};
};
export type Identity = {
  id: number;
  language: string;
  name: string;
};
export type Entrance = {
  login: Login;
};
export type Routing = {
  location: {
    pathname: string;
    search: string;
    hash: string;
    state: any;
    key: string;
  };
};
export type State = {
  modal: Modal;
  loadingCount: number;
  identity: Identity;
  entrance: Entrance;
  routing: Routing;
};
