import { Cache } from '../Cache';
import { CacheError } from '../CacheError';

// DONE
describe('Cache', () => {
  describe('set', () => {
    it('normal case', () => {
      const cache: Cache = new Cache();

      const identifier: symbol = Symbol('test');

      cache.set(identifier, 1);
      cache.set(identifier, 0);
      cache.set(identifier, 0.1);
      cache.set(identifier, NaN);
      cache.set(identifier, Infinity);
    });
  });

  describe('get', () => {
    it('normal case', () => {
      const cache: Cache = new Cache();
      const identifier1: symbol = Symbol('test');
      const identifier2: symbol = Symbol('test');
      const identifier3: symbol = Symbol('test');
      const identifier4: symbol = Symbol('test');
      const identifier5: symbol = Symbol('test');

      let n: number = 1;
      cache.set(identifier1, n);
      expect(cache.get<number>(identifier1)).toEqual(n);
      n = 0;
      cache.set(identifier2, n);
      expect(cache.get<number>(identifier2)).toEqual(n);
      n = 0.1;
      cache.set(identifier3, n);
      expect(cache.get<number>(identifier3)).toEqual(n);
      n = NaN;
      cache.set(identifier4, n);
      expect(cache.get<number>(identifier4)).toEqual(n);
      n = Infinity;
      cache.set(identifier5, n);
      expect(cache.get<number>(identifier5)).toEqual(n);
    });

    it('only retains the last one', () => {
      const cache: Cache = new Cache();
      const identifier1: symbol = Symbol('test');

      let n: number = 1;
      cache.set(identifier1, n);
      expect(cache.get<number>(identifier1)).toEqual(n);
      n = 0;
      cache.set(identifier1, n);
      expect(cache.get<number>(identifier1)).toEqual(n);
    });

    it('throws CacheError when value is not set', () => {
      const cache: Cache = new Cache();
      const identifier: symbol = Symbol('test');

      expect(() => {
        cache.get<number>(identifier);
      }).toThrow(CacheError);
    });
  });
});
