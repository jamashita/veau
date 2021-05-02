import { ICommand } from '../../Interface/ICommand';

export interface IRedisCommand extends ICommand<string, 'Redis'> {
  readonly source: 'Redis';
}
