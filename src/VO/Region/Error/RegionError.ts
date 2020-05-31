import { RuntimeError } from '@jamashita/publikum-error';

export class RegionError extends RuntimeError {
  public readonly name: 'RegionError' = 'RegionError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
