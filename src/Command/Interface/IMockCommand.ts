import { ICommand } from './ICommand';

export interface IMockCommand extends ICommand {
  readonly source: 'Mock';
}
