import { MysqlError } from 'mysql';
import { RuntimeError } from '../RuntimeError';

export class MySQLError extends RuntimeError implements MysqlError {
  public readonly name: 'MySQLError' = 'MySQLError';
  public readonly code: string;
  public readonly errno: number;
  public readonly sqlStateMarker?: string;
  public readonly sqlState?: string;
  public readonly fieldCount?: number;
  public readonly fatal: boolean;
  public readonly sql?: string;
  public readonly sqlMessage?: string;

  public constructor(err: MysqlError) {
    super(err.message);
    this.code = err.code;
    this.errno = err.errno;
    this.sqlStateMarker = err.sqlStateMarker;
    this.sqlState = err.sqlState;
    this.fieldCount = err.fieldCount;
    this.fatal = err.fatal;
    this.sql = err.sql;
    this.sqlMessage = err.sqlMessage;
  }
}
