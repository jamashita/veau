import { IQuery } from '../../Interface/IQuery';

export interface IMockQuery extends IQuery {
  readonly source: 'Mock';
}
