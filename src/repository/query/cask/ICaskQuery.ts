import { IQuery } from '../IQuery.js';

export interface ICaskQuery extends IQuery<string, 'Cask'> {
  readonly source: 'Cask';
}
