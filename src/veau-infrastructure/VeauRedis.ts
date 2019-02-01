import * as config from 'config';
import * as redis from 'redis';
import { Redis } from '../veau-general/Redis/Redis';

export const VeauRedis: Redis = new Redis(config.get<redis.ClientOpts>('redis'));
