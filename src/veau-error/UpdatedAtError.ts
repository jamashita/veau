import { RuntimeError } from '../veau-general/RuntimeError';

export class UpdatedAtError extends RuntimeError {
  public readonly name: 'UpdatedAtError' = 'UpdatedAtError';

  public constructor(message: string) {
    super(message);
  }
}
