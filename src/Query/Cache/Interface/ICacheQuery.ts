import { IQuery } from '../../Interface/IQuery';

export interface ICacheQuery extends IQuery {
  readonly source: 'Cache';
}
