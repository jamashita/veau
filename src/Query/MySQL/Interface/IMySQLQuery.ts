import { IQuery } from '../../Interface/IQuery';

export interface IMySQLQuery extends IQuery {
  readonly source: 'MySQL';
}
