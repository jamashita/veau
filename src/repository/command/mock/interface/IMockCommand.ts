import { ICommand } from '../../interface/ICommand';

export interface IMockCommand extends ICommand<string, 'Mock'> {
  readonly source: 'Mock';
}
