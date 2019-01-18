import * as mysql from 'mysql';
import {MysqlError, PoolConnection} from 'mysql';

export class MySQL {
  private pool: mysql.Pool;

  public constructor(config: mysql.PoolConfig) {
    const pool = mysql.createPool(config);

    pool.on('connection', (connection: mysql.Connection) => {
      connection.config.queryFormat = (query: string, values: any): string => {
        if (values === null || values === undefined) {
          return query;
        }

        return query.replace(/:(\w+)/g, (txt, key) => {
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
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err: MysqlError, connection: PoolConnection) => {
        if (err) {
          reject(err);
          return;
        }

        connection.beginTransaction((err) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(new Transaction(connection));
        });
      });
    });
  }

  public async transaction(callback: (transaction: Transaction) => Promise<void>): Promise<void> {
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
    return new Promise((resolve, reject) => {
      this.pool.query(sql, values, (err: mysql.MysqlError, result: any) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      });
    });
  }
}

export class Transaction {
  private connection: mysql.PoolConnection;

  public constructor(connection: mysql.PoolConnection) {
    this.connection = connection;
  }

  public query(sql: string, values?: Array<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, values, (err: mysql.MysqlError, result: any) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      });
    });
  }

  public commit(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.commit((err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  }

  public rollback(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.rollback((err) => {
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
