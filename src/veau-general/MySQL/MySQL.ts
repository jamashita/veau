import * as mysql from 'mysql';
import { Deal } from './Deal';
import { Query } from './Query';
import { Transaction } from './Transaction';

export class MySQL implements Query {
  private pool: mysql.Pool;

  public constructor(config: mysql.PoolConfig) {
    const pool: mysql.Pool = mysql.createPool(config);

    pool.on('connection', (connection: mysql.Connection): void => {
      connection.config.queryFormat = (query: string, value?: object): string => {
        if (value === undefined) {
          return query;
        }

        return query.replace(/:(\w+)/g, (txt: string, key: string): string => {
          if (value.hasOwnProperty(key)) {
            return connection.escape(value[key]);
          }

          return 'NULL';
        });
      };
    });

    this.pool = pool;
  }

  private getTransaction(): Promise<Transaction> {
    return new Promise<Transaction>((resolve: (value: Transaction) => void, reject: (reason: any) => void): void => {
      this.pool.getConnection((err1: mysql.MysqlError, connection: mysql.PoolConnection): void => {
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

  public async transact(deal: Deal): Promise<void> {
    const transaction: Transaction = await this.getTransaction();

    try {
      await deal.with(transaction);
      await transaction.commit();
      transaction.release();
    }
    catch (err) {
      await transaction.rollback();
      transaction.release();
      throw err;
    }
  }

  public execute(sql: string, value?: object): Promise<any> {
    return new Promise<any>((resolve: (value: any) => void, reject: (reason: any) => void): void => {
      this.pool.query(sql, value, (err: mysql.MysqlError, result: any): void => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      });
    });
  }
}
