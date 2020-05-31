import { RuntimeError } from '@jamashita/publikum-error';

export class RegionsError extends RuntimeError {
  public readonly name: 'RegionsError' = 'RegionsError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
