import { IQuery } from '../../interface/IQuery';

export interface IFetchQuery extends IQuery<string, 'Fetch'> {
  readonly source: 'Fetch';
}
