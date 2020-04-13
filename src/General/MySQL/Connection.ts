import mysql from 'mysql';
import { Reject, Resolve } from '../Type/Function';
import { JSObjectNotation, Nullable } from '../Type/Value';
import { IConnection } from './Interface/IConnection';
import { MySQLError } from './MySQLError';

export class Connection implements IConnection {
  private readonly connection: mysql.PoolConnection;

  public constructor(connection: mysql.PoolConnection) {
    this.connection = connection;
  }

  public execute<R>(sql: string, value?: JSObjectNotation): Promise<R> {
    return new Promise<R>((resolve: Resolve<R>, reject: Reject) => {
      this.connection.query(sql, value, (err: Nullable<mysql.MysqlError>, result: R) => {
        if (err !== null) {
          reject(new MySQLError('Connection.execute()', err));
          return;
        }

        resolve(result);
      });
    });
  }

  public commit(): Promise<void> {
    return new Promise<void>((resolve: Resolve<void>, reject: Reject) => {
      this.connection.commit((err: mysql.MysqlError) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unnecessary-condition
        if (err) {
          reject(new MySQLError('Connection.commit()', err));
          return;
        }

        resolve();
      });
    });
  }

  public rollback(): Promise<void> {
    return new Promise<void>((resolve: Resolve<void>, reject: Reject) => {
      this.connection.rollback((err: mysql.MysqlError) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unnecessary-condition
        if (err) {
          reject(new MySQLError('Connection.rollback()', err));
          return;
        }

        resolve();
      });
    });
  }

  public release(): void {
    this.connection.release();
  }
}
