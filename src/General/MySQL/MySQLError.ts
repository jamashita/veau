import { DataSourceError } from '../DataSourceError';

export class MySQLError extends DataSourceError {
  public readonly name: 'MySQLError' = 'MySQLError';
  public readonly source: 'MySQL' = 'MySQL';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
