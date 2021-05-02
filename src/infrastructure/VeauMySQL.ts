import { MySQL, MySQLConfig } from '@jamashita/catacombe-mysql';
import config from 'config';

export const veauMySQL: MySQL = new MySQL(config.get<MySQLConfig>('mysql'));
