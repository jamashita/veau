import { RuntimeError } from './RuntimeError';

export class UnimplementedError extends RuntimeError {
  public readonly name: 'UnimplementedError' = 'UnimplementedError';

  public constructor(message: string = 'UNIMPLEMENTED', cause?: Error) {
    super(message, cause);
  }
}
