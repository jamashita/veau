import config from 'config';
import { Redis, RedisOptions } from 'publikum';

export const veauRedis: Redis = new Redis(config.get<RedisOptions>('redis'));
export const REDIS_LANGUAGE_KEY: string = 'LANGUAGES';
export const REDIS_REGION_KEY: string = 'REGIONS';
