import { IQuery } from '../interface/IQuery';

export interface IBinQuery extends IQuery<string, 'Bin'> {
  readonly source: 'Bin';
}
