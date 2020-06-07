import sinon, { SinonSpy } from 'sinon';

import { Superposition } from '@jamashita/publikum-monad';

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
    it('returns Dead when the argument is less than 1', () => {
      const superposition1: Superposition<LoadingCount, LoadingCountError> = LoadingCount.of(-1);
      const superposition2: Superposition<LoadingCount, LoadingCountError> = LoadingCount.of(-5.6);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      expect(superposition1.isDead()).toBe(true);
      expect(superposition2.isDead()).toBe(true);

      superposition1.transform<void>(
        () => {
          spy1();
        },
        (err: LoadingCountError) => {
          spy2();
          expect(err).toBeInstanceOf(LoadingCountError);
        }
      );

      superposition2.transform<void>(
        () => {
          spy3();
        },
        (err: LoadingCountError) => {
          spy4();
          expect(err).toBeInstanceOf(LoadingCountError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('returns Alive and its value is LoadingCount.default() when the argument 0', () => {
      const superposition: Superposition<LoadingCount, LoadingCountError> = LoadingCount.of(0);

      expect(superposition.isAlive()).toBe(true);
      expect(superposition.get()).toBe(LoadingCount.default());
    });

    it('returns Dead when the argument is not integer', () => {
      const superposition1: Superposition<LoadingCount, LoadingCountError> = LoadingCount.of(1.1);
      const superposition2: Superposition<LoadingCount, LoadingCountError> = LoadingCount.of(0.2);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      expect(superposition1.isDead()).toBe(true);
      expect(superposition2.isDead()).toBe(true);

      superposition1.transform<void>(
        () => {
          spy1();
        },
        (err: LoadingCountError) => {
          spy2();
          expect(err).toBeInstanceOf(LoadingCountError);
        }
      );

      superposition2.transform<void>(
        () => {
          spy3();
        },
        (err: LoadingCountError) => {
          spy4();
          expect(err).toBeInstanceOf(LoadingCountError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('returns Alive when the argument is positive and integer', () => {
      const value1: number = 6;
      const value2: number = 17;
      const superposition1: Superposition<LoadingCount, LoadingCountError> = LoadingCount.of(value1);
      const superposition2: Superposition<LoadingCount, LoadingCountError> = LoadingCount.of(value2);

      expect(superposition1.isAlive()).toBe(true);
      expect(superposition2.isAlive()).toBe(true);

      expect(superposition1.get().get()).toBe(value1);
      expect(superposition2.get().get()).toBe(value2);
    });
  });

  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const count1: LoadingCount = LoadingCount.of(1).get();
      const count2: LoadingCount = LoadingCount.of(2).get();
      const count3: LoadingCount = LoadingCount.of(1).get();

      expect(count1.equals(count1)).toBe(true);
      expect(count1.equals(count2)).toBe(false);
      expect(count1.equals(count3)).toBe(true);
    });
  });

  describe('isLoading', () => {
    it('LoadingCount.default() return false', () => {
      expect(LoadingCount.default().isLoading()).toBe(false);
    });

    it('normal case', () => {
      expect(LoadingCount.of(0).get().isLoading()).toBe(false);
      expect(LoadingCount.of(1).get().isLoading()).toBe(true);
      expect(LoadingCount.of(2).get().isLoading()).toBe(true);
    });
  });

  describe('increment', () => {
    it('normal case', () => {
      const count1: LoadingCount = LoadingCount.of(1).get();
      const count2: LoadingCount = count1.increment();

      expect(count2.get()).toBe(2);
      expect(count1).not.toBe(count2);
    });
  });

  describe('decrement', () => {
    it('normal case', () => {
      const count1: LoadingCount = LoadingCount.of(1).get();
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
    it('normal case', () => {
      const num: number = 1;
      const count: LoadingCount = LoadingCount.of(num).get();

      expect(count.toString()).toBe(num.toString());
    });
  });
});
