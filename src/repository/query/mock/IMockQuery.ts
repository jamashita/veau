import { IQuery } from '../IQuery.js';

export interface IMockQuery extends IQuery<string, 'Mock'> {
  readonly source: 'Mock';
}
