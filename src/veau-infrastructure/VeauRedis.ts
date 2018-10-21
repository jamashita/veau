import * as config from 'config';
import * as redis from 'redis';
import {Redis} from '../veau-general/Redis';

export const VeauRedis = new Redis(config.get<redis.ClientOpts>('redis'));
