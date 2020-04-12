import { ICommand } from './ICommand';

export interface ICacheCommand extends ICommand {
  readonly source: 'Cache';
}
