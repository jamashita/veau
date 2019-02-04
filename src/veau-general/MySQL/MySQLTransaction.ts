import * as mysql from 'mysql';

export class MySQLTransaction {
  private connection: mysql.PoolConnection;

  public constructor(connection: mysql.PoolConnection) {
    this.connection = connection;
  }

  public query(sql: string, values?: Array<any>): Promise<any> {
    return new Promise<any>((resolve: (value: any) => void, reject: (reason: any) => void): void => {
      this.connection.query(sql, values, (err: mysql.MysqlError | null, result: any): void => {
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
