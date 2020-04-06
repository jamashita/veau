import config from 'config';
import IORedis from 'ioredis';
import { Redis } from '../veau-general/Redis/Redis';

export const veauRedis: Redis = Redis.of(config.get<IORedis.RedisOptions>('redis'));
