import { RuntimeError } from './RuntimeError';

export class NotFoundError extends RuntimeError {

  public constructor() {
    super('NOT FOUND');
  }
}
