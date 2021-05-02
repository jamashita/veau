import { IQuery } from '../interface/IQuery';

export interface ICaskQuery extends IQuery<string, 'Cask'> {
  readonly source: 'Cask';
}
