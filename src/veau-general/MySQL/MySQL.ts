import * as mysql from 'mysql';
import { Transaction } from './Transaction';

export class MySQL {
  private pool: mysql.Pool;

  public constructor(config: mysql.PoolConfig) {
    const pool: mysql.Pool = mysql.createPool(config);

    pool.on('connection', (connection: mysql.Connection) => {
      connection.config.queryFormat = (query: string, values: any): string => {
        if (values === null) {
          return query;
        }
        if (values === undefined) {
          return query;
        }

        return query.replace(/:(\w+)/g, (txt: string, key: string): string => {
          if (values instanceof Array) {
            for (const value of values) {
              if (value.hasOwnProperty(key)) {
                return connection.escape(value[key]);
              }
            }
          }
          if (values.hasOwnProperty(key)) {
            return connection.escape(values[key]);
          }

          return 'NULL';
        });
      };
    });

    this.pool = pool;
  }

  private getTransaction(): Promise<Transaction> {
    return new Promise<Transaction>((resolve: (value: Transaction) => void, reject: (reason: any) => void): void => {
      this.pool.getConnection((err1: mysql.MysqlError | null, connection: mysql.PoolConnection): void => {
        if (err1) {
          reject(err1);
          return;
        }

        connection.beginTransaction((err2?: mysql.MysqlError): void => {
          if (err2) {
            reject(err2);
            return;
          }

          resolve(new Transaction(connection));
        });
      });
    });
  }

  public async transaction(callback: (transaction: Transaction) => Promise<any>): Promise<void> {
    const transaction: Transaction = await this.getTransaction();

    try {
      await callback(transaction);
      await transaction.commit();
      transaction.release();
    }
    catch (err) {
      await transaction.rollback();
      transaction.release();
      throw err;
    }
  }

  public query(sql: string, values?: Array<any>): Promise<any> {
    return new Promise<any>((resolve: (value: any) => void, reject: (reason: any) => void): void => {
      this.pool.query(sql, values, (err: mysql.MysqlError | null, result: any): void => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      });
    });
  }
}
