import { ICommand } from './ICommand';

export interface IHeapCommand extends ICommand {
  readonly source: 'Heap';
}
