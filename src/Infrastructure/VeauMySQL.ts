import config from 'config';
import mysql from 'mysql';
import { MySQL } from 'publikum';

export const veauMySQL: MySQL = new MySQL(config.get<mysql.PoolConfig>('mysql'));
