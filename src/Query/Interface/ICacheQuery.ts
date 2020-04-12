import { IQuery } from './IQuery';

export interface ICacheQuery extends IQuery {
  readonly source: 'Cache';
}
