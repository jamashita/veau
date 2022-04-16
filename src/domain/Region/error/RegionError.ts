import { RuntimeError } from '@jamashita/anden-error';

export class RegionError extends RuntimeError<'RegionError'> {
  public readonly noun: 'RegionError' = 'RegionError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
