import { RuntimeError } from '@jamashita/publikum-error';

export class RegionIDError extends RuntimeError {
  public readonly name: 'RegionIDError' = 'RegionIDError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
