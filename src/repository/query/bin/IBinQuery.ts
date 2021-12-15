import { IQuery } from '../IQuery.js';

export interface IBinQuery extends IQuery<string, 'Bin'> {
  readonly source: 'Bin';
}
