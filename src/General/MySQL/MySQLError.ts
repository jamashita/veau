import { DataSourceError } from '../DataSourceError';

export class MySQLError extends DataSourceError {
  public readonly name: 'MySQLError' = 'MySQLError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
