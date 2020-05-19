import { ICommand } from '../../Interface/ICommand';

export interface IMySQLCommand extends ICommand {
  readonly source: 'MySQL';
}
