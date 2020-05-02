import { RuntimeError } from 'publikum';

export class RegionIDError extends RuntimeError {
  public readonly name: 'RegionIDError' = 'RegionIDError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
