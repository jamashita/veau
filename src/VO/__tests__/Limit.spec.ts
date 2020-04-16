import sinon, { SinonSpy } from 'sinon';
import { LimitError } from '../../Error/LimitError';
import { Superposition } from '../../General/Superposition/Superposition';
import { Limit } from '../Limit';

// DONE
describe('Limit', () => {
  describe('default', () => {
    it('always returns 40', () => {
      expect(Limit.default().get()).toEqual(40);
    });

    it('returns singleton instance', () => {
      expect(Limit.default()).toBe(Limit.default());
    });
  });

  describe('of', () => {
    it('returns Failure when the argument is less than 1', () => {
      const superposition1: Superposition<Limit, LimitError> = Limit.of(1);
      const superposition2: Superposition<Limit, LimitError> = Limit.of(0);
      const superposition3: Superposition<Limit, LimitError> = Limit.of(-1);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      expect(superposition1.isSuccess()).toEqual(true);
      expect(superposition2.isFailure()).toEqual(true);
      expect(superposition3.isFailure()).toEqual(true);

      superposition2.match<void>(() => {
        spy1();
      }, (err: LimitError) => {
        spy2();
        expect(err).toBeInstanceOf(LimitError);
      });

      superposition3.match<void>(() => {
        spy3();
      }, (err: LimitError) => {
        spy4();
        expect(err).toBeInstanceOf(LimitError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
      expect(spy3.called).toEqual(false);
      expect(spy4.called).toEqual(true);
    });

    it('returns Failure when the argument is not integer', () => {
      const superposition1: Superposition<Limit, LimitError> = Limit.of(1.1);
      const superposition2: Superposition<Limit, LimitError> = Limit.of(0.2);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      expect(superposition1.isFailure()).toEqual(true);
      expect(superposition2.isFailure()).toEqual(true);

      superposition1.match<void>(() => {
        spy1();
      }, (err: LimitError) => {
        spy2();
        expect(err).toBeInstanceOf(LimitError);
      });

      superposition2.match<void>(() => {
        spy3();
      }, (err: LimitError) => {
        spy4();
        expect(err).toBeInstanceOf(LimitError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
      expect(spy3.called).toEqual(false);
      expect(spy4.called).toEqual(true);
    });

    it('returns Success and its value is Limit.default() when the argument 0', () => {
      const superposition: Superposition<Limit, LimitError> = Limit.of(40);

      expect(superposition.isSuccess()).toEqual(true);
      expect(superposition.get()).toBe(Limit.default());
    });
  });

  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const limit1: Limit = Limit.of(1).get();
      const limit2: Limit = Limit.of(2).get();
      const limit3: Limit = Limit.of(1).get();

      expect(limit1.equals(limit1)).toEqual(true);
      expect(limit1.equals(limit2)).toEqual(false);
      expect(limit1.equals(limit3)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const num: number = 1;
      const limit: Limit = Limit.of(num).get();

      expect(limit.toString()).toEqual(num.toString());
    });
  });
});
