import * as mysql from 'mysql';
import { Query } from './Query';

export class Transaction implements Query {
  private connection: mysql.PoolConnection;

  public constructor(connection: mysql.PoolConnection) {
    this.connection = connection;
  }

  public execute(sql: string, value?: object): Promise<any> {
    return new Promise<any>((resolve: (value: any) => void, reject: (reason: any) => void): void => {
      this.connection.query(sql, value, (err: mysql.MysqlError | null, result: any): void => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      });
    });
  }

  public commit(): Promise<void> {
    return new Promise<void>((resolve: () => void, reject: (reason: any) => void): void => {
      this.connection.commit((err: mysql.MysqlError | null) => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  }

  public rollback(): Promise<void> {
    return new Promise<void>((resolve: () => void, reject: (reason: any) => void): void => {
      this.connection.rollback((err: mysql.MysqlError | null) => {
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
