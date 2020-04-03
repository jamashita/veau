import 'jest';
import sinon, { SinonSpy } from 'sinon';
import { LimitError } from '../../veau-error/LimitError';
import { Try } from '../../veau-general/Try/Try';
import { Limit } from '../Limit';

describe('Limit', () => {
  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const limit1: Try<Limit, LimitError> = Limit.of(1);
      const limit2: Try<Limit, LimitError> = Limit.of(2);
      const limit3: Try<Limit, LimitError> = Limit.of(1);

      expect(limit1.get().equals(limit1.get())).toEqual(true);
      expect(limit1.get().equals(limit2.get())).toEqual(false);
      expect(limit1.get().equals(limit3.get())).toEqual(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const num: number = 1;
      const limit: Try<Limit, LimitError> = Limit.of(num);

      expect(limit.get().toString()).toEqual(num.toString());
    });
  });

  describe('of', () => {
    it('throws LimitError when the argument is less than 1', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const limit1: Try<Limit, LimitError> = Limit.of(1);
      const limit2: Try<Limit, LimitError> = Limit.of(0);
      const limit3: Try<Limit, LimitError> = Limit.of(-1);

      expect(limit1.isSuccess()).toEqual(true);
      expect(limit2.isFailure()).toEqual(true);
      expect(limit3.isFailure()).toEqual(true);

      limit2.match<void>(() => {
        spy1();
      }, (e: LimitError) => {
        spy2();
        expect(e).toBeInstanceOf(LimitError);
      });

      limit3.match<void>(() => {
        spy3();
      }, (e: LimitError) => {
        spy4();
        expect(e).toBeInstanceOf(LimitError);
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

      const limit1: Try<Limit, LimitError> = Limit.of(1.1);
      const limit2: Try<Limit, LimitError> = Limit.of(0.2);

      expect(limit1.isFailure()).toEqual(true);
      expect(limit2.isFailure()).toEqual(true);

      limit1.match<void>(() => {
        spy1();
      }, (e: LimitError) => {
        spy2();
        expect(e).toBeInstanceOf(LimitError);
      });

      limit2.match<void>(() => {
        spy3();
      }, (e: LimitError) => {
        spy4();
        expect(e).toBeInstanceOf(LimitError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
      expect(spy3.called).toEqual(false);
      expect(spy4.called).toEqual(true);
    });
  });
});
