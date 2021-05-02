import { ICommand } from '../interface/ICommand';

export interface IHeapCommand extends ICommand<string, 'Heap'> {
  readonly source: 'Heap';
}
