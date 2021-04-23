import { ICommand } from '../../Interface/ICommand';

export interface IFetchCommand extends ICommand<string, 'Fetch'> {
  readonly source: 'Fetch';
}
