import { BaseError } from 'make-error-cause';

export abstract class RuntimeError extends BaseError {
  public abstract readonly name: string;

  protected constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
