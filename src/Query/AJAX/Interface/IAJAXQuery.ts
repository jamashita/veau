import { IQuery } from '../../Interface/IQuery';

export interface IAJAXQuery extends IQuery<string, 'AJAX'> {
  readonly source: 'AJAX';
}
