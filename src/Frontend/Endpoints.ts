/* eslint-disable  @typescript-eslint/typedef */

export const Endpoints = {
  ENTRANCE: '/',
  STATS_LIST: '/statistics/list',
  STATS_EDIT: '/statistics/edit/:id',
  LOGOUT: '/logout',
  NOTFOUND: '*'
} as const;
