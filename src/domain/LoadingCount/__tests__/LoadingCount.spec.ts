import { LoadingCount } from '../LoadingCount';
import { LoadingCountError } from '../LoadingCountError';

describe('LoadingCount', () => {
  describe('default', () => {
    it('always returns 0 value', () => {
      expect(LoadingCount.default().get()).toBe(0);
    });

    it('returns singleton instance', () => {
      expect(LoadingCount.default()).toBe(LoadingCount.default());
    });
  });

  describe('of', () => {
    it('returns Dead when the argument is less than 1', () => {
      expect(() => {
        LoadingCount.of(-1);
      }).toThrow(LoadingCountError);
      expect(() => {
        LoadingCount.of(-5.6);
      }).toThrow(LoadingCountError);
    });

    it('returns Alive and its value is LoadingCount.default() when the argument 0', () => {
      const loadingCount: LoadingCount = LoadingCount.of(0);

      expect(loadingCount).toBe(LoadingCount.default());
    });

    it('returns Dead when the argument is not integer', () => {
      expect(() => {
        LoadingCount.of(1.1);
      }).toThrow(LoadingCountError);
      expect(() => {
        LoadingCount.of(0.2);
      }).toThrow(LoadingCountError);
    });

    it('returns Alive when the argument is positive and integer', () => {
      const value1: number = 6;
      const value2: number = 17;
      const loadingCount1: LoadingCount = LoadingCount.of(value1);
      const loadingCount2: LoadingCount = LoadingCount.of(value2);

      expect(loadingCount1.get()).toBe(value1);
      expect(loadingCount2.get()).toBe(value2);
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      const loadingCount: LoadingCount = LoadingCount.default();

      expect(loadingCount.equals(null)).toBe(false);
      expect(loadingCount.equals(undefined)).toBe(false);
      expect(loadingCount.equals('')).toBe(false);
      expect(loadingCount.equals('123')).toBe(false);
      expect(loadingCount.equals('abcd')).toBe(false);
      expect(loadingCount.equals(123)).toBe(false);
      expect(loadingCount.equals(0)).toBe(false);
      expect(loadingCount.equals(-12)).toBe(false);
      expect(loadingCount.equals(0.3)).toBe(false);
      expect(loadingCount.equals(false)).toBe(false);
      expect(loadingCount.equals(true)).toBe(false);
      expect(loadingCount.equals(Symbol('p'))).toBe(false);
      expect(loadingCount.equals(20n)).toBe(false);
      expect(loadingCount.equals({})).toBe(false);
      expect(loadingCount.equals([])).toBe(false);
      expect(loadingCount.equals(Object.create(null))).toBe(false);
    });

    it('returns true if both properties are the same', () => {
      const count1: LoadingCount = LoadingCount.of(1);
      const count2: LoadingCount = LoadingCount.of(2);
      const count3: LoadingCount = LoadingCount.of(1);

      expect(count1.equals(count1)).toBe(true);
      expect(count1.equals(count2)).toBe(false);
      expect(count1.equals(count3)).toBe(true);
    });
  });

  describe('isLoading', () => {
    it('loadingCount.default() return false', () => {
      expect(LoadingCount.default().isLoading()).toBe(false);
    });

    it('normal case', () => {
      const count1: LoadingCount = LoadingCount.of(0);
      const count2: LoadingCount = LoadingCount.of(1);
      const count3: LoadingCount = LoadingCount.of(2);

      expect(count1.isLoading()).toBe(false);
      expect(count2.isLoading()).toBe(true);
      expect(count3.isLoading()).toBe(true);
    });
  });

  describe('increment', () => {
    it('normal case', () => {
      const count1: LoadingCount = LoadingCount.of(1);
      const count2: LoadingCount = count1.increment();

      expect(count2.get()).toBe(2);
      expect(count1).not.toBe(count2);
    });
  });

  describe('decrement', () => {
    it('normal case', () => {
      const count1: LoadingCount = LoadingCount.of(1);
      const count2: LoadingCount = count1.decrement();
      const count3: LoadingCount = count2.decrement();

      expect(count2.get()).toBe(0);
      expect(count3.get()).toBe(0);
      expect(count1).not.toBe(count2);
      expect(count2).toBe(LoadingCount.default());
      expect(count3).toBe(LoadingCount.default());
    });
  });
});
