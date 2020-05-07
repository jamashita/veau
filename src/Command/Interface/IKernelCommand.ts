import { ICommand } from './ICommand';

export interface IKernelCommand extends ICommand {
  readonly source: 'Kernel';
}
