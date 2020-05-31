import 'reflect-metadata';

import { IRedis, Redis } from '@jamashita/publikum-redis';

import { kernel } from '../../Container/Kernel';
import { Type } from '../../Container/Types';

describe('VeauRedis', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const redis1: IRedis = kernel.get<IRedis>(Type.Redis);
      const redis2: IRedis = kernel.get<IRedis>(Type.Redis);

      expect(redis1).toBeInstanceOf(Redis);
      expect(redis1).toBe(redis2);
    });
  });
});
