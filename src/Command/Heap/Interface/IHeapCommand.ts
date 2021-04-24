import { ICommand } from '../../Interface/ICommand';

export interface IHeapCommand extends ICommand<string, 'Heap'> {
  readonly source: 'Heap';
}
