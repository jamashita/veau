import { IQuery } from '../../Interface/IQuery';

export interface IAJAXQuery extends IQuery {
  readonly source: 'AJAX';
}
