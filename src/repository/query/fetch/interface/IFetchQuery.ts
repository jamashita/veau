import { IQuery } from '../../Interface/IQuery';

export interface IFetchQuery extends IQuery<string, 'Fetch'> {
  readonly source: 'Fetch';
}
