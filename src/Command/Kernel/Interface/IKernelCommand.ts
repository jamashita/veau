import { ICommand } from '../../Interface/ICommand';

export interface IKernelCommand extends ICommand {
  readonly source: 'Kernel';
}
