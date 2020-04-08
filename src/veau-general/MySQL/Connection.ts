import mysql from 'mysql';
import { Reject, Resolve } from '../Type/Function';
import { Nullable } from '../Type/Value';
import { IConnection } from './interfaces/IConnection';
import { MySQLError } from './MySQLError';

export class Connection implements IConnection {
  private readonly connection: mysql.PoolConnection;

  public constructor(connection: mysql.PoolConnection) {
    this.connection = connection;
  }

  public execute<T>(sql: string, value?: object): Promise<T> {
    return new Promise<T>((resolve: Resolve<T>, reject: Reject) => {
      this.connection.query(sql, value, (err: Nullable<mysql.MysqlError>, result: T) => {
        if (err !== null) {
          reject(new MySQLError(err));
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
          reject(new MySQLError(err));
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
          reject(new MySQLError(err));
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
