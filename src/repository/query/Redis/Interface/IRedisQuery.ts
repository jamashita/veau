import { IQuery } from '../../Interface/IQuery';

export interface IRedisQuery extends IQuery<string, 'Redis'> {
  readonly source: 'Redis';
}
