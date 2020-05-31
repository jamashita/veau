import { RuntimeError } from '@jamashita/publikum-error';

export class HeaderSizeError extends RuntimeError {
  public readonly name: 'HeaderSizeError' = 'HeaderSizeError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
