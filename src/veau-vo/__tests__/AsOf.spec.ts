import 'jest';
import sinon, { SinonSpy } from 'sinon';
import { AsOfError } from '../../veau-error/AsOfError';
import { Try } from '../../veau-general/Try/Try';
import { AsOf } from '../AsOf';
import { Term } from '../Term';

describe('AsOf', () => {
  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const asOf1: Try<AsOf, AsOfError> = AsOf.ofString('2000-01-01 00:00:00');
      const asOf2: Try<AsOf, AsOfError> = AsOf.ofString('2000-01-02 00:00:00');
      const asOf3: Try<AsOf, AsOfError> = AsOf.ofString('2000-01-01 00:00:00');

      expect(asOf1.get().equals(asOf1.get())).toEqual(true);
      expect(asOf1.get().equals(asOf2.get())).toEqual(false);
      expect(asOf1.get().equals(asOf3.get())).toEqual(true);
    });
  });

  describe('isBefore', () => {
    it('returns true if the value is before than the other', () => {
      const asOf1: Try<AsOf, AsOfError> = AsOf.ofString('2000-01-02 00:00:00');
      const asOf2: Try<AsOf, AsOfError> = AsOf.ofString('2000-01-03 00:00:00');
      const asOf3: Try<AsOf, AsOfError> = AsOf.ofString('2000-01-04 00:00:00');

      expect(asOf2.get().isBefore(asOf1.get())).toEqual(false);
      expect(asOf2.get().isBefore(asOf2.get())).toEqual(false);
      expect(asOf2.get().isBefore(asOf3.get())).toEqual(true);
    });
  });

  describe('isAfter', () => {
    it('returns true if the value is after than the other', () => {
      const asOf1: Try<AsOf, AsOfError> = AsOf.ofString('2000-01-02 00:00:00');
      const asOf2: Try<AsOf, AsOfError> = AsOf.ofString('2000-01-03 00:00:00');
      const asOf3: Try<AsOf, AsOfError> = AsOf.ofString('2000-01-04 00:00:00');

      expect(asOf2.get().isAfter(asOf1.get())).toEqual(true);
      expect(asOf2.get().isAfter(asOf2.get())).toEqual(false);
      expect(asOf2.get().isAfter(asOf3.get())).toEqual(false);
    });
  });

  describe('previous', () => {
    it('Term.DAILY', () => {
      const asOf: Try<AsOf, AsOfError> = AsOf.ofString('2000-01-01');
      const newAsOf: AsOf = asOf.get().previous(Term.DAILY);

      expect(asOf.get().toString()).toEqual('2000-01-01');
      expect(newAsOf.toString()).toEqual('1999-12-31');
    });

    it('Term.WEEKLY', () => {
      const asOf: Try<AsOf, AsOfError> = AsOf.ofString('2000-01-01');
      const newAsOf: AsOf = asOf.get().previous(Term.WEEKLY);

      expect(asOf.get().toString()).toEqual('2000-01-01');
      expect(newAsOf.toString()).toEqual('1999-12-25');
    });

    it('Term.MONTHLY', () => {
      const asOf: Try<AsOf, AsOfError> = AsOf.ofString('2000-01-01');
      const newAsOf: AsOf = asOf.get().previous(Term.MONTHLY);

      expect(asOf.get().toString()).toEqual('2000-01-01');
      expect(newAsOf.toString()).toEqual('1999-12-01');
    });

    it('Term.QUARTERLY', () => {
      const asOf: Try<AsOf, AsOfError> = AsOf.ofString('2000-01-01');
      const newAsOf: AsOf = asOf.get().previous(Term.QUARTERLY);

      expect(asOf.get().toString()).toEqual('2000-01-01');
      expect(newAsOf.toString()).toEqual('1999-10-01');
    });

    it('Term.ANNUAL', () => {
      const asOf: Try<AsOf, AsOfError> = AsOf.ofString('2000-01-01');
      const newAsOf: AsOf = asOf.get().previous(Term.ANNUAL);

      expect(asOf.get().toString()).toEqual('2000-01-01');
      expect(newAsOf.toString()).toEqual('1999-01-01');
    });
  });

  describe('next', () => {
    it('Term.DAILY', () => {
      const asOf: Try<AsOf, AsOfError> = AsOf.ofString('2000-01-01');
      const newAsOf: AsOf = asOf.get().next(Term.DAILY);

      expect(asOf.get().toString()).toEqual('2000-01-01');
      expect(newAsOf.toString()).toEqual('2000-01-02');
    });

    it('Term.WEEKLY', () => {
      const asOf: Try<AsOf, AsOfError> = AsOf.ofString('2000-01-01');
      const newAsOf: AsOf = asOf.get().next(Term.WEEKLY);

      expect(asOf.get().toString()).toEqual('2000-01-01');
      expect(newAsOf.toString()).toEqual('2000-01-08');
    });

    it('Term.MONTHLY', () => {
      const asOf: Try<AsOf, AsOfError> = AsOf.ofString('2000-01-01');
      const newAsOf: AsOf = asOf.get().next(Term.MONTHLY);

      expect(asOf.get().toString()).toEqual('2000-01-01');
      expect(newAsOf.toString()).toEqual('2000-02-01');
    });

    it('Term.QUARTERLY', () => {
      const asOf: Try<AsOf, AsOfError> = AsOf.ofString('2000-01-01');
      const newAsOf: AsOf = asOf.get().next(Term.QUARTERLY);

      expect(asOf.get().toString()).toEqual('2000-01-01');
      expect(newAsOf.toString()).toEqual('2000-04-01');
    });

    it('Term.ANNUAL', () => {
      const asOf: Try<AsOf, AsOfError> = AsOf.ofString('2000-01-01');
      const newAsOf: AsOf = asOf.get().next(Term.ANNUAL);

      expect(asOf.get().toString()).toEqual('2000-01-01');
      expect(newAsOf.toString()).toEqual('2001-01-01');
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const asOf: Try<AsOf, AsOfError> = AsOf.ofString('2000-01-01');

      expect(asOf.get().toString()).toEqual('2000-01-01');
    });
  });

  describe('ofString', () => {
    it('normal case', () => {
      const asOf1: Try<AsOf, AsOfError> = AsOf.ofString('2000-01-01');
      const asOf2: Try<AsOf, AsOfError> = AsOf.ofString('2000-01-01 00:00:00');

      expect(asOf1.isSuccess()).toEqual(true);
      expect(asOf2.isSuccess()).toEqual(true);
    });

    it('will throw AsOfError because the string format is not compatible to date time', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const asOf1: Try<AsOf, AsOfError> = AsOf.ofString('deux mille');
      const asOf2: Try<AsOf, AsOfError> = AsOf.ofString('dos mil');

      expect(asOf1.isFailure()).toEqual(true);
      expect(asOf2.isFailure()).toEqual(true);

      asOf1.match<void>(() => {
        spy1();
      }, (e: AsOfError) => {
        spy2();
        expect(e).toBeInstanceOf(AsOfError);
      });

      asOf2.match<void>(() => {
        spy3();
      }, (e: AsOfError) => {
        spy4();
        expect(e).toBeInstanceOf(AsOfError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
      expect(spy3.called).toEqual(false);
      expect(spy4.called).toEqual(true);
    });
  });
});
