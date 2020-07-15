import { Schrodinger, Superposition } from '@jamashita/publikum-monad';

import { LimitError } from '../Error/LimitError';
import { Limit } from '../Limit';

describe('Limit', () => {
  describe('default', () => {
    it('always returns 40', () => {
      expect(Limit.default().get()).toBe(40);
    });

    it('returns singleton instance', () => {
      expect(Limit.default()).toBe(Limit.default());
    });
  });

  describe('of', () => {
    it('returns Dead when the argument is less than 1', async () => {
      const superposition1: Superposition<Limit, LimitError> = Limit.of(1);
      const superposition2: Superposition<Limit, LimitError> = Limit.of(0);
      const superposition3: Superposition<Limit, LimitError> = Limit.of(-1);
      const schrodinger1: Schrodinger<Limit, LimitError> = await superposition1.terminate();
      const schrodinger2: Schrodinger<Limit, LimitError> = await superposition2.terminate();
      const schrodinger3: Schrodinger<Limit, LimitError> = await superposition3.terminate();

      expect(schrodinger1.isAlive()).toBe(true);
      expect(schrodinger2.isDead()).toBe(true);
      expect(() => {
        schrodinger2.get();
      }).toThrow(LimitError);
      expect(schrodinger3.isDead()).toBe(true);
      expect(() => {
        schrodinger3.get();
      }).toThrow(LimitError);
    });

    it('returns Dead when the argument is not integer', async () => {
      const superposition1: Superposition<Limit, LimitError> = Limit.of(1.1);
      const superposition2: Superposition<Limit, LimitError> = Limit.of(0.2);
      const schrodinger1: Schrodinger<Limit, LimitError> = await superposition1.terminate();
      const schrodinger2: Schrodinger<Limit, LimitError> = await superposition2.terminate();

      expect(schrodinger1.isDead()).toBe(true);
      expect(() => {
        schrodinger1.get();
      }).toThrow(LimitError);
      expect(schrodinger2.isDead()).toBe(true);
      expect(() => {
        schrodinger2.get();
      }).toThrow(LimitError);
    });

    it('returns Alive and its value is Limit.default() when the argument 0', async () => {
      const superposition: Superposition<Limit, LimitError> = Limit.of(40);
      const schrodinger: Schrodinger<Limit, LimitError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(Limit.default());
    });
  });

  describe('equals', () => {
    it('returns true if both properties are the same', async () => {
      const limit1: Limit = await Limit.of(1).get();
      const limit2: Limit = await Limit.of(2).get();
      const limit3: Limit = await Limit.of(1).get();

      expect(limit1.equals(limit1)).toBe(true);
      expect(limit1.equals(limit2)).toBe(false);
      expect(limit1.equals(limit3)).toBe(true);
    });
  });

  describe('toString', () => {
    it('normal case', async () => {
      const num: number = 1;
      const limit: Limit = await Limit.of(num).get();

      expect(limit.toString()).toBe(num.toString());
    });
  });
});
