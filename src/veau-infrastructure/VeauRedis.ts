import config from 'config';
import * as IORedis from 'ioredis';
import { Redis } from '../veau-general/Redis/Redis';

export const veauRedis: Redis = new Redis(config.get<IORedis.RedisOptions>('redis'));
