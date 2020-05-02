import config from 'config';
import { MySQL, MySQLConfig } from 'publikum';

export const veauMySQL: MySQL = new MySQL(config.get<MySQLConfig>('mysql'));
