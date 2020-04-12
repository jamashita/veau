import config from 'config';
import mysql from 'mysql';
import { MySQL } from '../General/MySQL/MySQL';

export const veauMySQL: MySQL = new MySQL(config.get<mysql.PoolConfig>('mysql'));
