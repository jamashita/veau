import 'jest';
import sinon, { SinonSpy } from 'sinon';
import { LimitError } from '../../veau-error/LimitError';
import { Try } from '../../veau-general/Try/Try';
import { Limit } from '../Limit';

describe('Limit', () => {
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

  describe('of', () => {
    it('throws LimitError when the argument is less than 1', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const trial1: Try<Limit, LimitError> = Limit.of(1);
      const trial2: Try<Limit, LimitError> = Limit.of(0);
      const trial3: Try<Limit, LimitError> = Limit.of(-1);

      expect(trial1.isSuccess()).toEqual(true);
      expect(trial2.isFailure()).toEqual(true);
      expect(trial3.isFailure()).toEqual(true);

      trial2.match<void>(() => {
        spy1();
      }, (err: LimitError) => {
        spy2();
        expect(err).toBeInstanceOf(LimitError);
      });

      trial3.match<void>(() => {
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

    it('throws LimitError when the argument is not integer', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const trial1: Try<Limit, LimitError> = Limit.of(1.1);
      const trial2: Try<Limit, LimitError> = Limit.of(0.2);

      expect(trial1.isFailure()).toEqual(true);
      expect(trial2.isFailure()).toEqual(true);

      trial1.match<void>(() => {
        spy1();
      }, (err: LimitError) => {
        spy2();
        expect(err).toBeInstanceOf(LimitError);
      });

      trial2.match<void>(() => {
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
  });
});
