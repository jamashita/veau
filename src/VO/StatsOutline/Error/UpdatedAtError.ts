import { RuntimeError } from '@jamashita/publikum-error';

export class UpdatedAtError extends RuntimeError<'UpdatedAtError'> {
  public readonly noun: 'UpdatedAtError' = 'UpdatedAtError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
