import { RuntimeError } from '@jamashita/publikum-error';

export class RegionsError extends RuntimeError<'RegionsError'> {
  public readonly noun: 'RegionsError' = 'RegionsError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
