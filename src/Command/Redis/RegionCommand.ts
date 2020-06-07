import { inject, injectable } from 'inversify';

import { DataSourceError } from '@jamashita/publikum-error';
import { JSONA, JSONAError } from '@jamashita/publikum-json';
import { Alive, Dead, Schrodinger, Superposition } from '@jamashita/publikum-monad';
import { IRedis, RedisError } from '@jamashita/publikum-redis';

import { Type } from '../../Container/Types';
import { REDIS_REGION_KEY } from '../../Infrastructure/VeauRedis';
import { Regions } from '../../VO/Region/Regions';
import { IRegionCommand } from '../Interface/IRegionCommand';
import { IRedisCommand } from './Interface/IRedisCommand';

const DURATION: number = 3 * 60 * 60;

@injectable()
export class RegionCommand implements IRegionCommand, IRedisCommand {
  public readonly noun: 'RegionCommand' = 'RegionCommand';
  public readonly source: 'Redis' = 'Redis';
  private readonly redis: IRedis;

  public constructor(@inject(Type.Redis) redis: IRedis) {
    this.redis = redis;
  }

  public async insertAll(regions: Regions): Promise<Superposition<unknown, DataSourceError>> {
    const superposition: Superposition<string, JSONAError> = await Schrodinger.playground<string, JSONAError>(() => {
      return JSONA.stringify(regions.toJSON());
    });

    return superposition.transform<unknown, RedisError>(
      (str: string) => {
        return Schrodinger.playground<unknown, RedisError>(async () => {
          await this.redis.getString().set(REDIS_REGION_KEY, str);

          return this.redis.expires(REDIS_REGION_KEY, DURATION);
        });
      },
      (err: JSONAError) => {
        return Dead.of<RedisError>(new RedisError('RegionCommand.insertAll()', err));
      }
    );
  }

  public async deleteAll(): Promise<Superposition<unknown, DataSourceError>> {
    const superposition: Superposition<boolean, RedisError> = await Schrodinger.playground<boolean, RedisError>(() => {
      return this.redis.delete(REDIS_REGION_KEY);
    });

    return superposition.transform<unknown, RedisError>(
      (ok: boolean) => {
        if (ok) {
          return Alive.of<RedisError>();
        }

        return Dead.of<RedisError>(new RedisError('FAIL TO DELETE CACHE'));
      },
      (err: RedisError) => {
        return Dead.of<RedisError>(err);
      }
    );
  }
}
