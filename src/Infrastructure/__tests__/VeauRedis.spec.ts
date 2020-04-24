import { Redis } from 'publikum';
import 'reflect-metadata';
import { kernel } from '../../Container/Kernel';
import { TYPE } from '../../Container/Types';

describe('VeauRedis', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const redis1: Redis = kernel.get<Redis>(TYPE.Redis);
      const redis2: Redis = kernel.get<Redis>(TYPE.Redis);

      expect(redis1).toBeInstanceOf(Redis);
      expect(redis1).toBe(redis2);
    });
  });
});
