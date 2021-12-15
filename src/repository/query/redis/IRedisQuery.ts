import { IQuery } from '../IQuery.js';

export interface IRedisQuery extends IQuery<string, 'Redis'> {
  readonly source: 'Redis';
}
