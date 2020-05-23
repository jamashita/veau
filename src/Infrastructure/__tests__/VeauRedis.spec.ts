import 'reflect-metadata';

import { Redis } from 'publikum';

import { kernel } from '../../Container/Kernel';
import { Type } from '../../Container/Types';

describe('VeauRedis', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const redis1: Redis = kernel.get<Redis>(Type.Redis);
      const redis2: Redis = kernel.get<Redis>(Type.Redis);

      expect(redis1).toBeInstanceOf(Redis);
      expect(redis1).toBe(redis2);
    });
  });
});
