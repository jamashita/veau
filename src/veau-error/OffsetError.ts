import { RuntimeError } from '../veau-general/RuntimeError';

export class OffsetError extends RuntimeError {
  public readonly name: 'OffsetError' = 'OffsetError';

  public constructor(message: string) {
    super(message);
  }
}
