import { IQuery } from '../../Interface/IQuery';

export interface IMySQLQuery extends IQuery<string, 'MySQL'> {
  readonly source: 'MySQL';
}
