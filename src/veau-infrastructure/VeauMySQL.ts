import * as config from 'config';
import * as mysql from 'mysql';
import { MySQL } from '../veau-general/MySQL/MySQL';

export const VeauMySQL: MySQL = new MySQL(config.get<mysql.PoolConfig>('mysql'));
