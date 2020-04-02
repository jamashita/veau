import mysql from 'mysql';
import { Reject } from '../Type/Reject';
import { Resolve } from '../Type/Resolve';
import { IQuery } from './IQuery';

export class Connection implements IQuery {
  private connection: mysql.PoolConnection;

  public constructor(connection: mysql.PoolConnection) {
    this.connection = connection;
  }

  public execute<T>(sql: string, value?: object): Promise<T> {
    return new Promise<T>((resolve: Resolve<T>, reject: Reject) => {
      this.connection.query(sql, value, (err: mysql.MysqlError | null, result: T) => {
        if (err !== null) {
          reject(err);
          return;
        }

        resolve(result);
      });
    });
  }

  public commit(): Promise<unknown> {
    return new Promise<unknown>((resolve: Resolve<void>, reject: Reject) => {
      this.connection.commit((err: mysql.MysqlError) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unnecessary-condition
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  }

  public rollback(): Promise<unknown> {
    return new Promise<unknown>((resolve: Resolve<void>, reject: Reject) => {
      this.connection.rollback((err: mysql.MysqlError) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unnecessary-condition
        if (err) {
          reject(err);
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
