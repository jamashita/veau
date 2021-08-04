import { ICommand } from '../ICommand.js';

export interface ICaskCommand extends ICommand<string, 'Cask'> {
  readonly source: 'Cask';
}
