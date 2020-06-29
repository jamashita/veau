import { ICommand } from '../../Interface/ICommand';

export interface IAJAXCommand extends ICommand<string, 'AJAX'> {
  readonly source: 'AJAX';
}
