import { ICommand } from '../interface/ICommand';

export interface IRedisCommand extends ICommand<string, 'Redis'> {
  readonly source: 'Redis';
}
