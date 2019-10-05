import mysql from 'mysql';
import { Reject } from '../Type/Reject';
import { Resolve } from '../Type/Resolve';
import { Connection } from './Connection';
import { IQuery } from './IQuery';
import { ITransaction } from './ITransaction';

type Value = {
  [key: string]: unknown;
};

export class MySQL implements IQuery {
  private pool: mysql.Pool;

  public constructor(config: mysql.PoolConfig) {
    const pool: mysql.Pool = mysql.createPool(config);

    pool.on('connection', (connection: mysql.Connection): void => {
      connection.config.queryFormat = (query: string, value?: Value): string => {
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

  private getConnection(): Promise<Connection> {
    return new Promise<Connection>((resolve: Resolve<Connection>, reject: Reject<unknown>): void => {
      this.pool.getConnection((err1: mysql.MysqlError, connection: mysql.PoolConnection): void => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (err1) {
          reject(err1);
          return;
        }

        connection.beginTransaction((err2: mysql.MysqlError): void => {
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          if (err2) {
            reject(err2);
            return;
          }

          resolve(new Connection(connection));
        });
      });
    });
  }

  public async transact(transaction: ITransaction): Promise<void> {
    const connection: Connection = await this.getConnection();

    try {
      await transaction.with(connection);
      await connection.commit();
      connection.release();
    }
    catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  }

  public execute<T>(sql: string, value?: object): Promise<T> {
    return new Promise<T>((resolve: Resolve<T>, reject: Reject<unknown>): void => {
      this.pool.query(sql, value, (err: mysql.MysqlError | null, result: T): void => {
        if (err !== null) {
          reject(err);
          return;
        }

        resolve(result);
      });
    });
  }
}
