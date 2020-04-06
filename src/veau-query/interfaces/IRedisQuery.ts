import { ICommand } from '../../veau-command/interfaces/ICommand';

export interface IRedisQuery extends ICommand {
  readonly source: 'Redis';
}
