import { ICommand } from '../ICommand.js';

export interface IFetchCommand extends ICommand<string, 'Fetch'> {
  readonly source: 'Fetch';
}
