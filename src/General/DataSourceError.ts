import { RuntimeError } from './RuntimeError';

export abstract class DataSourceError extends RuntimeError {
  public abstract readonly name: string;

  protected constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
