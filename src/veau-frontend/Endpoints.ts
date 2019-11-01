export type EndpointType = {
  ENTRANCE: string;
  STATS_LIST: string;
  STATS_EDIT: string;
  LOGOUT: string;
  NOTFOUND: string;
};

export const Endpoints: EndpointType = {
  ENTRANCE: '/',
  STATS_LIST: '/statistics/list',
  STATS_EDIT: '/statistics/edit/:id',
  LOGOUT: '/logout',
  NOTFOUND: '*'
};
