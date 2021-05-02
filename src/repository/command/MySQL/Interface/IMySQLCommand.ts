import { ICommand } from '../../Interface/ICommand';

export interface IMySQLCommand extends ICommand<string, 'MySQL'> {
  readonly source: 'MySQL';
}
