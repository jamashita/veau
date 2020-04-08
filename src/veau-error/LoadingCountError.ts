import { RuntimeError } from '../veau-general/RuntimeError';

export class LoadingCountError extends RuntimeError {
  public readonly name: 'LoadingCountError' = 'LoadingCountError';

  public constructor(message: string) {
    super(message);
  }
}
