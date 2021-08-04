import { ICommand } from '../ICommand.js';

export interface IMySQLCommand extends ICommand<string, 'MySQL'> {
  readonly source: 'MySQL';
}
