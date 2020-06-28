import { RuntimeError } from '@jamashita/publikum-error';

export class RegionIDError extends RuntimeError<'RegionIDError'> {
  public readonly noun: 'RegionIDError' = 'RegionIDError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
