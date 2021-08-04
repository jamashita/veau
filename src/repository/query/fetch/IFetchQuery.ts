import { IQuery } from '../IQuery.js';

export interface IFetchQuery extends IQuery<string, 'Fetch'> {
  readonly source: 'Fetch';
}
