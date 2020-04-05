import { ICommand } from '../interfaces/ICommand';

export interface RedisCommand extends ICommand {
  readonly source: 'Redis';
}
