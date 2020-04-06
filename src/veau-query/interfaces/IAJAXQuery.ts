import { IQuery } from './IQuery';

export interface IAJAXQuery extends IQuery {
  readonly source: 'AJAX';
}
