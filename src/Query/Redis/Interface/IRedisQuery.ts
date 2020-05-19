import { IQuery } from '../../Interface/IQuery';

export interface IRedisQuery extends IQuery {
  readonly source: 'Redis';
}
