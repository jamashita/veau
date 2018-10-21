export type ModalJSON = {
  open: boolean;
  title: string;
  description: string;
  values?: {[key: string]: string};
};
export type IdentityJSON = {
  id: number;
  language: string;
  locale: string;
  name: string;
};
export type EntranceJSON = {
  loginAttemptEnabled: boolean;
  name: string;
  password: string;
};
export type RoutingJSON = {
  location: {
    pathname: string;
    search: string;
    hash: string;
    state: any;
    key: string;
  };
};
export type State = {
  modal: ModalJSON;
  loadingCount: number;
  identity: IdentityJSON;
  entrance: EntranceJSON;
  routing: RoutingJSON;
};
