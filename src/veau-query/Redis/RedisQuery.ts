import { ICommand } from '../../veau-command/interfaces/ICommand';

export interface RedisQuery extends ICommand {
  readonly source: 'Redis';
}
