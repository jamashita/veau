import { ICommand } from '../../interface/ICommand';

export interface IFetchCommand extends ICommand<string, 'Fetch'> {
  readonly source: 'Fetch';
}
