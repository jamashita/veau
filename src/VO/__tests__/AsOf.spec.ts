import sinon, { SinonSpy } from 'sinon';
import { AsOfError } from '../../Error/AsOfError';
import { Superposition } from '../../General/Superposition/Superposition';
import { AsOf } from '../AsOf';
import { MockTerm } from '../Mock/MockTerm';
import { Term } from '../Term';
import { Terms } from '../Terms';

describe('AsOf', () => {
  describe('ofString', () => {
    it('normal case', () => {
      const superposition1: Superposition<AsOf, AsOfError> = AsOf.ofString('2000-01-01');
      const superposition2: Superposition<AsOf, AsOfError> = AsOf.ofString('2000-01-01');

      expect(superposition1.isSuccess()).toBe(true);
      expect(superposition2.isSuccess()).toBe(true);
    });

    it('will return Failure because the string format is not compatible to date time', () => {
      const superposition1: Superposition<AsOf, AsOfError> = AsOf.ofString('deux mille');
      const superposition2: Superposition<AsOf, AsOfError> = AsOf.ofString('dos mil');
      const superposition3: Superposition<AsOf, AsOfError> = AsOf.ofString('2000-01-01 01:02:03');

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();
      const spy5: SinonSpy = sinon.spy();
      const spy6: SinonSpy = sinon.spy();

      expect(superposition1.isFailure()).toBe(true);
      expect(superposition2.isFailure()).toBe(true);
      expect(superposition3.isFailure()).toBe(true);
      superposition1.match<void>(() => {
        spy1();
      }, (err: AsOfError) => {
        spy2();
        expect(err).toBeInstanceOf(AsOfError);
      });

      superposition2.match<void>(() => {
        spy3();
      }, (err: AsOfError) => {
        spy4();
        expect(err).toBeInstanceOf(AsOfError);
      });

      superposition2.match<void>(() => {
        spy5();
      }, (err: AsOfError) => {
        spy6();
        expect(err).toBeInstanceOf(AsOfError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
      expect(spy5.called).toBe(false);
      expect(spy6.called).toBe(true);
    });
  });

  describe('format', () => {
    it('returns YYYY-MM-DD', () => {
      expect(AsOf.format()).toBe('YYYY-MM-DD');
    });
  });

  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const asOf1: AsOf = AsOf.ofString('2000-01-01').get();
      const asOf2: AsOf = AsOf.ofString('2000-01-02').get();
      const asOf3: AsOf = AsOf.ofString('2000-01-01').get();

      expect(asOf1.equals(asOf1)).toBe(true);
      expect(asOf1.equals(asOf2)).toBe(false);
      expect(asOf1.equals(asOf3)).toBe(true);
    });
  });

  describe('isBefore', () => {
    it('returns true if the value is before than the other', () => {
      const asOf1: AsOf = AsOf.ofString('2000-01-02').get();
      const asOf2: AsOf = AsOf.ofString('2000-01-03').get();
      const asOf3: AsOf = AsOf.ofString('2000-01-04').get();

      expect(asOf2.isBefore(asOf1)).toBe(false);
      expect(asOf2.isBefore(asOf2)).toBe(false);
      expect(asOf2.isBefore(asOf3)).toBe(true);
    });
  });

  describe('isAfter', () => {
    it('returns true if the value is after than the other', () => {
      const asOf1: AsOf = AsOf.ofString('2000-01-02').get();
      const asOf2: AsOf = AsOf.ofString('2000-01-03').get();
      const asOf3: AsOf = AsOf.ofString('2000-01-04').get();

      expect(asOf2.isAfter(asOf1)).toBe(true);
      expect(asOf2.isAfter(asOf2)).toBe(false);
      expect(asOf2.isAfter(asOf3)).toBe(false);
    });
  });

  describe('previous', () => {
    it('Term.DAILY', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01').get();
      const newAsOf: AsOf = asOf.previous(Term.DAILY);

      expect(asOf.toString()).toBe('2000-01-01');
      expect(newAsOf.toString()).toBe('1999-12-31');
    });

    it('Term.WEEKLY', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01').get();
      const newAsOf: AsOf = asOf.previous(Term.WEEKLY);

      expect(asOf.toString()).toBe('2000-01-01');
      expect(newAsOf.toString()).toBe('1999-12-25');
    });

    it('Term.MONTHLY', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01').get();
      const newAsOf: AsOf = asOf.previous(Term.MONTHLY);

      expect(asOf.toString()).toBe('2000-01-01');
      expect(newAsOf.toString()).toBe('1999-12-01');
    });

    it('Term.QUARTERLY', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01').get();
      const newAsOf: AsOf = asOf.previous(Term.QUARTERLY);

      expect(asOf.toString()).toBe('2000-01-01');
      expect(newAsOf.toString()).toBe('1999-10-01');
    });

    it('Term.ANNUAL', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01').get();
      const newAsOf: AsOf = asOf.previous(Term.ANNUAL);

      expect(asOf.toString()).toBe('2000-01-01');
      expect(newAsOf.toString()).toBe('1999-01-01');
    });

    it('all', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01').get();
      const allTerm: Terms = Terms.all();

      for (let i: number = 0; i < allTerm.size(); i++) {
        expect(() => {
          asOf.previous(allTerm.get(i).get());
        }).not.toThrow(AsOfError);
      }
    });

    it('throws AsOfError because this situation is not considered', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01').get();
      const fakeTerm: MockTerm = new MockTerm();

      expect(() => {
        asOf.previous(fakeTerm);
      }).toThrow(AsOfError);
    });
  });

  describe('next', () => {
    it('Term.DAILY', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01').get();
      const newAsOf: AsOf = asOf.next(Term.DAILY);

      expect(asOf.toString()).toBe('2000-01-01');
      expect(newAsOf.toString()).toBe('2000-01-02');
    });

    it('Term.WEEKLY', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01').get();
      const newAsOf: AsOf = asOf.next(Term.WEEKLY);

      expect(asOf.toString()).toBe('2000-01-01');
      expect(newAsOf.toString()).toBe('2000-01-08');
    });

    it('Term.MONTHLY', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01').get();
      const newAsOf: AsOf = asOf.next(Term.MONTHLY);

      expect(asOf.toString()).toBe('2000-01-01');
      expect(newAsOf.toString()).toBe('2000-02-01');
    });

    it('Term.QUARTERLY', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01').get();
      const newAsOf: AsOf = asOf.next(Term.QUARTERLY);

      expect(asOf.toString()).toBe('2000-01-01');
      expect(newAsOf.toString()).toBe('2000-04-01');
    });

    it('Term.ANNUAL', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01').get();
      const newAsOf: AsOf = asOf.next(Term.ANNUAL);

      expect(asOf.toString()).toBe('2000-01-01');
      expect(newAsOf.toString()).toBe('2001-01-01');
    });

    it('all', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01').get();
      const allTerm: Terms = Terms.all();

      for (let i: number = 0; i < allTerm.size(); i++) {
        expect(() => {
          asOf.next(allTerm.get(i).get());
        }).not.toThrow(AsOfError);
      }
    });

    it('throws AsOfError because this situation is not considered', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01').get();
      const fakeTerm: MockTerm = new MockTerm();

      expect(() => {
        asOf.next(fakeTerm);
      }).toThrow(AsOfError);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const asOf: string = '2000-01-01';

      expect(AsOf.ofString(asOf).get().toString()).toBe(asOf);
    });
  });
});
