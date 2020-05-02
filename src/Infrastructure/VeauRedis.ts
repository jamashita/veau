import config from 'config';
import { Redis, RedisConfig } from 'publikum';

export const veauRedis: Redis = new Redis(config.get<RedisConfig>('redis'));
export const REDIS_LANGUAGE_KEY: string = 'LANGUAGES';
export const REDIS_REGION_KEY: string = 'REGIONS';
