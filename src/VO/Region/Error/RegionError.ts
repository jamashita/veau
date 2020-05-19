import { RuntimeError } from 'publikum';

export class RegionError extends RuntimeError {
  public readonly name: 'RegionError' = 'RegionError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
