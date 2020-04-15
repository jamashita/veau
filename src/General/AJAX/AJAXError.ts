import { DataSourceError } from '../DataSourceError';

export class AJAXError extends DataSourceError {
  public readonly name: 'AJAXError' = 'AJAXError';
  public readonly source: 'AJAX' = 'AJAX';
  public readonly status: number;

  public constructor(message: string, status: number, cause?: Error) {
    super(message, cause);
    this.status = status;
  }
}
