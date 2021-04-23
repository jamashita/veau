import { ICommand } from '../../Interface/ICommand';

export interface ICacheCommand extends ICommand<string, 'Cache'> {
  readonly source: 'Cache';
}
