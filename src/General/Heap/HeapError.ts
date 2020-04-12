import { DataSourceError } from '../DataSourceError';

export class HeapError extends DataSourceError {
  public readonly name: 'HeapError' = 'HeapError';

  public constructor(message: string) {
    super(message);
  }
}
