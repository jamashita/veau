import { MysqlError } from 'mysql';
import { MySQLError } from './MySQLError';

const err: MysqlError = {
  name: 'MockMysqlError',
  message: 'mock',
  code: 'MOCK',
  errno: -1,
  fatal: false
};

export class MockMySQLError extends MySQLError {

  public constructor() {
    super(err);
  }
}
