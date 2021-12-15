import { ICommand } from '../ICommand.js';

export interface IMockCommand extends ICommand<string, 'Mock'> {
  readonly source: 'Mock';
}
