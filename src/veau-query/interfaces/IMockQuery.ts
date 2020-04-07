import { IQuery } from './IQuery';

export interface IMockQuery extends IQuery {
  readonly source: 'Mock';
}
