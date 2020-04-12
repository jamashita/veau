import { DataSourceError } from '../DataSourceError';

export class AJAXError extends DataSourceError {
  public readonly name: 'AJAXError' = 'AJAXError';

  public constructor(message: string) {
    super(message);
  }
}
