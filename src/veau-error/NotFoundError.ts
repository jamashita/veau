import { RuntimeError } from '../veau-general/RuntimeError';

export class NotFoundError extends RuntimeError {

  public constructor() {
    super('NOT FOUND');
  }
}
