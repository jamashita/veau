import { IQuery } from '../../interface/IQuery';

export interface IMySQLQuery extends IQuery<string, 'MySQL'> {
  readonly source: 'MySQL';
}
