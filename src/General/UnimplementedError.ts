import { RuntimeError } from './RuntimeError';

export class UnimplementedError extends RuntimeError {
  public readonly name: 'UnimplementedError' = 'UnimplementedError';

  public constructor() {
    super('UNIMPLEMENTED');
  }
}
