import { ICommand } from '../ICommand.js';

export interface IRedisCommand extends ICommand<string, 'Redis'> {
  readonly source: 'Redis';
}
