import { RuntimeError } from '../General/RuntimeError';

export class OffsetError extends RuntimeError {
  public readonly name: 'OffsetError' = 'OffsetError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
