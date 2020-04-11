import { IQuery } from './IQuery';

export interface IRedisQuery extends IQuery {
  readonly source: 'Redis';
}
