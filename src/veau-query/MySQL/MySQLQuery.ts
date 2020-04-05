import { ICommand } from '../../veau-command/interfaces/ICommand';

export interface MySQLQuery extends ICommand {
  readonly source: 'MySQL';
}
