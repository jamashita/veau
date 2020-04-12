import { IQuery } from './IQuery';

export interface IMySQLQuery extends IQuery {
  readonly source: 'MySQL';
}
