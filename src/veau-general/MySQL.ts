import * as mysql from 'mysql';
import * as log4js from 'log4js';

const logger = log4js.getLogger();

export const TIMEOUT = 'ETIMEDOUT';
export const CONNECTION_RESET = 'ECONNRESET';
export const PACKET_TOO_LARGE = 'ER_NET_PACKET_TOO_LARGE';
export const UNABLE_TO_VERIFY_LEAF_SIGNATURE = 'UNABLE_TO_VERIFY_LEAF_SIGNATURE';
export const EPROTO = 'EPROTO';

export class MySQL {
  pool: mysql.Pool;

  public constructor(config: mysql.PoolConfig) {
    const pool = mysql.createPool(config);

    pool.on('connection', (connection: mysql.Connection) => {
      connection.config.queryFormat = (query, values): string => {
        // eslint-enable no-param-reassign
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
          else if (values.hasOwnProperty(key)) {
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
      this.pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
          return;
        }
        if (connection === undefined) {
          logger.fatal('CONNECTION IS undefined');
          reject(new Error());
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

  public async transaction(callback: (transaction: Transaction) => Promise<any>): Promise<void> {
    const transaction = await this.getTransaction();

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
