import { ICommand } from '../../Interface/ICommand';

export interface IRedisCommand extends ICommand {
  readonly source: 'Redis';
}
