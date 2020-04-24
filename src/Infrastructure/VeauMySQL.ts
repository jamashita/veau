import config from 'config';
import { MySQL, PoolConfig } from 'publikum';

export const veauMySQL: MySQL = new MySQL(config.get<PoolConfig>('mysql'));
