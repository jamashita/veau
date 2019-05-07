import * as config from 'config';
import * as IORedis from 'ioredis';
import { Redis } from '@/veau-general/Redis/Redis';

export const VeauRedis: Redis = new Redis(config.get<IORedis.RedisOptions>('redis'));
