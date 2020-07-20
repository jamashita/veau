import { MySQL, MySQLConfig } from '@jamashita/publikum-mysql';
import config from 'config';

export const veauMySQL: MySQL = new MySQL(config.get<MySQLConfig>('mysql'));
