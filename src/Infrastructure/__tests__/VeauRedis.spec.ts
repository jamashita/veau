import { IRedis, Redis } from '@jamashita/publikum-redis';
import 'reflect-metadata';
import { kernel } from '../../Container/Kernel';
import { Type } from '../../Container/Types';

describe('VeauRedis', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const redis1: IRedis = kernel.get<IRedis>(Type.Redis);
      const redis2: IRedis = kernel.get<IRedis>(Type.Redis);

      expect(redis1).toBeInstanceOf(Redis);
      expect(redis1).toBe(redis2);
    });
  });
});
