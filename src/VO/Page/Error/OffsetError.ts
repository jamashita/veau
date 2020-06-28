import { RuntimeError } from '@jamashita/publikum-error';

export class OffsetError extends RuntimeError<'OffsetError'> {
  public readonly noun: 'OffsetError' = 'OffsetError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
