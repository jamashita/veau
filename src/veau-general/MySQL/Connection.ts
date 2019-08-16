import * as mysql from 'mysql';
import { IQuery } from './IQuery';

export class Connection implements IQuery {
  private connection: mysql.PoolConnection;

  public constructor(connection: mysql.PoolConnection) {
    this.connection = connection;
  }

  public execute(sql: string, value?: object): Promise<any> {
    return new Promise<any>((resolve: (value: any) => void, reject: (reason: any) => void): void => {
      this.connection.query(sql, value, (err: mysql.MysqlError | null, result: any): void => {
        if (err !== null) {
          reject(err);
          return;
        }

        resolve(result);
      });
    });
  }

  public commit(): Promise<any> {
    return new Promise<any>((resolve: () => void, reject: (reason: any) => void): void => {
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

  public rollback(): Promise<any> {
    return new Promise<any>((resolve: () => void, reject: (reason: any) => void): void => {
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
