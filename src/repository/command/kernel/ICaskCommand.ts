import { ICommand } from '../interface/ICommand';

export interface ICaskCommand extends ICommand<string, 'Cask'> {
  readonly source: 'Cask';
}
