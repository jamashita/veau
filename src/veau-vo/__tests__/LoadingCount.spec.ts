import sinon, { SinonSpy } from 'sinon';
import { LoadingCountError } from '../../veau-error/LoadingCountError';
import { Try } from '../../veau-general/Try/Try';
import { LoadingCount } from '../LoadingCount';

describe('LoadingCount', () => {
  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const count1: LoadingCount = LoadingCount.of(1).get();
      const count2: LoadingCount = LoadingCount.of(2).get();
      const count3: LoadingCount = LoadingCount.of(1).get();

      expect(count1.equals(count1)).toEqual(true);
      expect(count1.equals(count2)).toEqual(false);
      expect(count1.equals(count3)).toEqual(true);
    });
  });

  describe('isLoading', () => {
    it('normal case', () => {
      expect(LoadingCount.of(0).get().isLoading()).toEqual(false);
      expect(LoadingCount.of(1).get().isLoading()).toEqual(true);
      expect(LoadingCount.of(2).get().isLoading()).toEqual(true);
    });
  });

  describe('increment', () => {
    it('normal case', () => {
      const count1: LoadingCount = LoadingCount.of(1).get();
      const count2: LoadingCount = count1.increment();

      expect(count2.get()).toEqual(2);
      expect(count1).not.toBe(count2);
    });
  });

  describe('decrement', () => {
    it('normal case', () => {
      const count1: LoadingCount = LoadingCount.of(1).get();
      const count2: LoadingCount = count1.decrement();
      const count3: LoadingCount = count2.decrement();

      expect(count2.get()).toEqual(0);
      expect(count3.get()).toEqual(0);
      expect(count1).not.toBe(count2);
      expect(count2).not.toBe(count3);
      expect(count3).not.toBe(count1);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const num: number = 1;
      const count: LoadingCount = LoadingCount.of(num).get();

      expect(count.toString()).toEqual(num.toString());
    });
  });

  describe('of', () => {
    it('returns Failure when the argument is less than 1', () => {
      const trial1: Try<LoadingCount, LoadingCountError> = LoadingCount.of(1);
      const trial2: Try<LoadingCount, LoadingCountError> = LoadingCount.of(0);
      const trial3: Try<LoadingCount, LoadingCountError> = LoadingCount.of(-1);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      expect(trial1.isSuccess()).toEqual(true);
      expect(trial2.isSuccess()).toEqual(true);
      expect(trial3.isFailure()).toEqual(true);

      trial3.match<void>(() => {
        spy1();
      }, (err: LoadingCountError) => {
        spy2();
        expect(err).toBeInstanceOf(LoadingCountError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns Failure when the argument is not integer', () => {
      const trial1: Try<LoadingCount, LoadingCountError> = LoadingCount.of(1.1);
      const trial2: Try<LoadingCount, LoadingCountError> = LoadingCount.of(0.2);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      expect(trial1.isFailure()).toEqual(true);
      expect(trial2.isFailure()).toEqual(true);

      trial1.match<void>(() => {
        spy1();
      }, (err: LoadingCountError) => {
        spy2();
        expect(err).toBeInstanceOf(LoadingCountError);
      });

      trial2.match<void>(() => {
        spy3();
      }, (err: LoadingCountError) => {
        spy4();
        expect(err).toBeInstanceOf(LoadingCountError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
      expect(spy3.called).toEqual(false);
      expect(spy4.called).toEqual(true);
    });
  });

  describe('default', () => {
    it('always returns 0 value', () => {
      for (let i: number = 0; i < 100; i++) {
        expect(LoadingCount.default().get()).toEqual(0);
      }
    });
  });
});
