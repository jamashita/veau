import { Schrodinger, Superposition } from '@jamashita/publikum-monad';

import { LoadingCountError } from '../Error/LoadingCountError';
import { LoadingCount } from '../LoadingCount';

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
    it('returns Dead when the argument is less than 1', async () => {
      const superposition1: Superposition<LoadingCount, LoadingCountError> = LoadingCount.of(-1);
      const superposition2: Superposition<LoadingCount, LoadingCountError> = LoadingCount.of(-5.6);
      const schrodinger1: Schrodinger<LoadingCount, LoadingCountError> = await superposition1.terminate();
      const schrodinger2: Schrodinger<LoadingCount, LoadingCountError> = await superposition2.terminate();

      expect(schrodinger1.isDead()).toBe(true);
      expect(() => {
        schrodinger1.get();
      }).toThrow(LoadingCountError);
      expect(schrodinger2.isDead()).toBe(true);
      expect(() => {
        schrodinger2.get();
      }).toThrow(LoadingCountError);
    });

    it('returns Alive and its value is LoadingCount.default() when the argument 0', async () => {
      const superposition: Superposition<LoadingCount, LoadingCountError> = LoadingCount.of(0);
      const schrodinger: Schrodinger<LoadingCount, LoadingCountError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(LoadingCount.default());
    });

    it('returns Dead when the argument is not integer', async () => {
      const superposition1: Superposition<LoadingCount, LoadingCountError> = LoadingCount.of(1.1);
      const superposition2: Superposition<LoadingCount, LoadingCountError> = LoadingCount.of(0.2);
      const schrodinger1: Schrodinger<LoadingCount, LoadingCountError> = await superposition1.terminate();
      const schrodinger2: Schrodinger<LoadingCount, LoadingCountError> = await superposition2.terminate();

      expect(schrodinger1.isDead()).toBe(true);
      expect(() => {
        schrodinger1.get();
      }).toThrow(LoadingCountError);
      expect(schrodinger2.isDead()).toBe(true);
      expect(() => {
        schrodinger2.get();
      }).toThrow(LoadingCountError);
    });

    it('returns Alive when the argument is positive and integer', async () => {
      const value1: number = 6;
      const value2: number = 17;
      const superposition1: Superposition<LoadingCount, LoadingCountError> = LoadingCount.of(value1);
      const superposition2: Superposition<LoadingCount, LoadingCountError> = LoadingCount.of(value2);
      const schrodinger1: Schrodinger<LoadingCount, LoadingCountError> = await superposition1.terminate();
      const schrodinger2: Schrodinger<LoadingCount, LoadingCountError> = await superposition2.terminate();

      expect(schrodinger1.isAlive()).toBe(true);
      expect(schrodinger2.isAlive()).toBe(true);

      expect(schrodinger1.get().get()).toBe(value1);
      expect(schrodinger2.get().get()).toBe(value2);
    });
  });

  describe('equals', () => {
    it('returns true if both properties are the same', async () => {
      const count1: LoadingCount = await LoadingCount.of(1).get();
      const count2: LoadingCount = await LoadingCount.of(2).get();
      const count3: LoadingCount = await LoadingCount.of(1).get();

      expect(count1.equals(count1)).toBe(true);
      expect(count1.equals(count2)).toBe(false);
      expect(count1.equals(count3)).toBe(true);
    });
  });

  describe('isLoading', () => {
    it('LoadingCount.default() return false', () => {
      expect(LoadingCount.default().isLoading()).toBe(false);
    });

    it('normal case', async () => {
      const count1: LoadingCount = await LoadingCount.of(0).get();
      const count2: LoadingCount = await LoadingCount.of(1).get();
      const count3: LoadingCount = await LoadingCount.of(2).get();

      expect(count1.isLoading()).toBe(false);
      expect(count2.isLoading()).toBe(true);
      expect(count3.isLoading()).toBe(true);
    });
  });

  describe('increment', () => {
    it('normal case', async () => {
      const count1: LoadingCount = await LoadingCount.of(1).get();
      const count2: LoadingCount = count1.increment();

      expect(count2.get()).toBe(2);
      expect(count1).not.toBe(count2);
    });
  });

  describe('decrement', () => {
    it('normal case', async () => {
      const count1: LoadingCount = await LoadingCount.of(1).get();
      const count2: LoadingCount = count1.decrement();
      const count3: LoadingCount = count2.decrement();

      expect(count2.get()).toBe(0);
      expect(count3.get()).toBe(0);
      expect(count1).not.toBe(count2);
      expect(count2).toBe(LoadingCount.default());
      expect(count3).toBe(LoadingCount.default());
    });
  });

  describe('toString', () => {
    it('normal case', async () => {
      const num: number = 1;
      const count: LoadingCount = await LoadingCount.of(num).get();

      expect(count.toString()).toBe(num.toString());
    });
  });
});
