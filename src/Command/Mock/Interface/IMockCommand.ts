import { ICommand } from '../../Interface/ICommand';

export interface IMockCommand extends ICommand {
  readonly source: 'Mock';
}
