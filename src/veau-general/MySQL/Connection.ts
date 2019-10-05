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
    return new Promise<T>((resolve: Resolve<T>, reject: Reject<unknown>): void => {
      this.connection.query(sql, value, (err: mysql.MysqlError | null, result: T): void => {
        if (err !== null) {
          reject(err);
          return;
        }

        resolve(result);
      });
    });
  }

  public commit(): Promise<unknown> {
    return new Promise<unknown>((resolve: Resolve<void>, reject: Reject<unknown>): void => {
      this.connection.commit((err: mysql.MysqlError): void => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  }

  public rollback(): Promise<unknown> {
    return new Promise<unknown>((resolve: Resolve<void>, reject: Reject<unknown>): void => {
      this.connection.rollback((err: mysql.MysqlError): void => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
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
