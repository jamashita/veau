import { ICommand } from '../../Interface/ICommand';

export interface IAJAXCommand extends ICommand {
  readonly source: 'AJAX';
}
