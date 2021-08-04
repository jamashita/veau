import { IQuery } from '../IQuery.js';

export interface IMySQLQuery extends IQuery<string, 'MySQL'> {
  readonly source: 'MySQL';
}
