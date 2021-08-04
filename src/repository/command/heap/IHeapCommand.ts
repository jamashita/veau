import { ICommand } from '../ICommand.js';

export interface IHeapCommand extends ICommand<string, 'Heap'> {
  readonly source: 'Heap';
}
