import 'jest';
import 'reflect-metadata';
import { kernel } from '../../veau-container/Container';
import { TYPE } from '../../veau-container/Types';
import { Redis } from '../../veau-general/Redis/Redis';

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
