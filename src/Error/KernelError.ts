import { DataSourceError } from '@jamashita/publikum-error';

export class KernelError extends DataSourceError<'KernelError', 'Kernel'> {
  public readonly noun: 'KernelError' = 'KernelError';
  public readonly source: 'Kernel' = 'Kernel';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
