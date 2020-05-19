import { ICommand } from '../../Interface/ICommand';

export interface ICacheCommand extends ICommand {
  readonly source: 'Cache';
}
