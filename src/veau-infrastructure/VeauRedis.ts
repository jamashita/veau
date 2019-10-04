import config from 'config';
import IORedis from 'ioredis';
import { Redis } from '../veau-general/Redis/Redis';

export const veauRedis: Redis = new Redis(config.get<IORedis.RedisOptions>('redis'));
