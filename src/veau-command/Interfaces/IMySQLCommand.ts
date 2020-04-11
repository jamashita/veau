import { ICommand } from './ICommand';

export interface IMySQLCommand extends ICommand {
  readonly source: 'MySQL';
}
