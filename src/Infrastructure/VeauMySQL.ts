import config from 'config';

import { MySQL, MySQLConfig } from '@jamashita/publikum-mysql';

export const veauMySQL: MySQL = new MySQL(config.get<MySQLConfig>('mysql'));
