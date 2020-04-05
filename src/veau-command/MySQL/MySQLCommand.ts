import { ICommand } from '../interfaces/ICommand';

export interface MySQLCommand extends ICommand {
  readonly source: 'MySQL';
}
