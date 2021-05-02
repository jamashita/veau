import { IQuery } from '../../interface/IQuery';

export interface IRedisQuery extends IQuery<string, 'Redis'> {
  readonly source: 'Redis';
}
