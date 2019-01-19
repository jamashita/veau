import * as config from 'config';
import * as mysql from 'mysql';
import {MySQL} from '../veau-general/MySQL';

export const VeauMySQL = new MySQL(config.get<mysql.PoolConfig>('mysql'));
