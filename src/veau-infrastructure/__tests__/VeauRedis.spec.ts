import 'jest';
import 'reflect-metadata';
import { container } from '../../veau-container/Container';
import { TYPE } from '../../veau-container/Types';
import { Redis } from '../../veau-general/Redis/Redis';

describe('VeauRedis', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const redis1: Redis = container.get<Redis>(TYPE.Redis);
      const redis2: Redis = container.get<Redis>(TYPE.Redis);

      expect(redis1 instanceof Redis).toEqual(true);
      expect(redis1).toBe(redis2);
    });
  });
});
