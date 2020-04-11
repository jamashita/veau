import { ICommand } from './ICommand';

export interface IRedisCommand extends ICommand {
  readonly source: 'Redis';
}
