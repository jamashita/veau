import { RuntimeError } from '../General/RuntimeError';

export class LoadingCountError extends RuntimeError {
  public readonly name: 'LoadingCountError' = 'LoadingCountError';

  public constructor(message: string) {
    super(message);
  }
}
