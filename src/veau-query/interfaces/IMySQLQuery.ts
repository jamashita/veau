import { ICommand } from '../../veau-command/interfaces/ICommand';

export interface IMySQLQuery extends ICommand {
  readonly source: 'MySQL';
}
