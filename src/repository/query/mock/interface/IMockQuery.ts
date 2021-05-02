import { IQuery } from '../../interface/IQuery';

export interface IMockQuery extends IQuery<string, 'Mock'> {
  readonly source: 'Mock';
}
