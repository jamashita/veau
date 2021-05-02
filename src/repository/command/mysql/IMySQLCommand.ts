import { ICommand } from '../interface/ICommand';

export interface IMySQLCommand extends ICommand<string, 'MySQL'> {
  readonly source: 'MySQL';
}
