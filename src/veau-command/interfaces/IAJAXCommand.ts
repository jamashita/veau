import { ICommand } from './ICommand';

export interface IAJAXCommand extends ICommand {
  readonly source: 'AJAX';
}
