import { Nullable } from '@jamashita/anden-type';
import { MockTerm } from '../../Term/Mock/MockTerm';
import { Term } from '../../Term/Term';
import { Terms } from '../../Term/Terms';
import { AsOf } from '../AsOf';
import { AsOfError } from '../Error/AsOfError';

describe('AsOf', () => {
  describe('ofString', () => {
    it('normal case', () => {
      expect.assertions(2);

      const date1: string = '2000-01-01';
      const date2: string = '2000-01-03';
      const asOf1: AsOf = AsOf.ofString(date1);
      const asOf2: AsOf = AsOf.ofString(date2);

      expect(asOf1.toString()).toBe(date1);
      expect(asOf2.toString()).toBe(date2);
    });

    it('will return Dead because the string format is not compatible to date time', () => {
      expect.assertions(3);

      expect(() => {
        AsOf.ofString('deux mille');
      }).toThrow(AsOfError);
      expect(() => {
        AsOf.ofString('dos mil');
      }).toThrow(AsOfError);
      expect(() => {
        AsOf.ofString('2000-01-01 01:02:03');
      }).toThrow(AsOfError);
    });
  });

  describe('format', () => {
    it('returns YYYY-MM-DD', () => {
      expect.assertions(1);

      expect(AsOf.format()).toBe('YYYY-MM-DD');
    });
  });

  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      expect.assertions(3);

      const asOf1: AsOf = AsOf.ofString('2000-01-01');
      const asOf2: AsOf = AsOf.ofString('2000-01-02');
      const asOf3: AsOf = AsOf.ofString('2000-01-01');

      expect(asOf1.equals(asOf1)).toBe(true);
      expect(asOf1.equals(asOf2)).toBe(false);
      expect(asOf1.equals(asOf3)).toBe(true);
    });
  });

  describe('isBefore', () => {
    it('returns true if the value is before than the other', () => {
      expect.assertions(3);

      const asOf1: AsOf = AsOf.ofString('2000-01-02');
      const asOf2: AsOf = AsOf.ofString('2000-01-03');
      const asOf3: AsOf = AsOf.ofString('2000-01-04');

      expect(asOf2.isBefore(asOf1)).toBe(false);
      expect(asOf2.isBefore(asOf2)).toBe(false);
      expect(asOf2.isBefore(asOf3)).toBe(true);
    });
  });

  describe('isAfter', () => {
    it('returns true if the value is after than the other', () => {
      expect.assertions(3);

      const asOf1: AsOf = AsOf.ofString('2000-01-02');
      const asOf2: AsOf = AsOf.ofString('2000-01-03');
      const asOf3: AsOf = AsOf.ofString('2000-01-04');

      expect(asOf2.isAfter(asOf1)).toBe(true);
      expect(asOf2.isAfter(asOf2)).toBe(false);
      expect(asOf2.isAfter(asOf3)).toBe(false);
    });
  });

  describe('previous', () => {
    it('term.DAILY', () => {
      expect.assertions(2);

      const asOf: AsOf = AsOf.ofString('2000-01-01');
      const newAsOf: AsOf = asOf.previous(Term.DAILY);

      expect(asOf.toString()).toBe('2000-01-01');
      expect(newAsOf.toString()).toBe('1999-12-31');
    });

    it('term.WEEKLY', () => {
      expect.assertions(2);

      const asOf: AsOf = AsOf.ofString('2000-01-01');
      const newAsOf: AsOf = asOf.previous(Term.WEEKLY);

      expect(asOf.toString()).toBe('2000-01-01');
      expect(newAsOf.toString()).toBe('1999-12-25');
    });

    it('term.MONTHLY', () => {
      expect.assertions(2);

      const asOf: AsOf = AsOf.ofString('2000-01-01');
      const newAsOf: AsOf = asOf.previous(Term.MONTHLY);

      expect(asOf.toString()).toBe('2000-01-01');
      expect(newAsOf.toString()).toBe('1999-12-01');
    });

    it('term.QUARTERLY', () => {
      expect.assertions(2);

      const asOf: AsOf = AsOf.ofString('2000-01-01');
      const newAsOf: AsOf = asOf.previous(Term.QUARTERLY);

      expect(asOf.toString()).toBe('2000-01-01');
      expect(newAsOf.toString()).toBe('1999-10-01');
    });

    it('term.ANNUAL', () => {
      expect.assertions(2);

      const asOf: AsOf = AsOf.ofString('2000-01-01');
      const newAsOf: AsOf = asOf.previous(Term.ANNUAL);

      expect(asOf.toString()).toBe('2000-01-01');
      expect(newAsOf.toString()).toBe('1999-01-01');
    });

    it('all', () => {
      expect.assertions(5);

      const asOf: AsOf = AsOf.ofString('2000-01-01');
      const allTerm: Terms = Terms.all();

      allTerm.map<void>((term: Term) => {
        expect(() => {
          const t: Nullable<Term> = allTerm.get(term.getTermID());

          asOf.previous(t as Term);
        }).not.toThrow(AsOfError);
      });
    });

    it('throws AsOfError because this situation is not considered', () => {
      expect.assertions(1);

      const asOf: AsOf = AsOf.ofString('2000-01-01');
      const fakeTerm: MockTerm = new MockTerm();

      expect(() => {
        asOf.previous(fakeTerm);
      }).toThrow(AsOfError);
    });
  });

  describe('next', () => {
    it('term.DAILY', () => {
      expect.assertions(2);

      const asOf: AsOf = AsOf.ofString('2000-01-01');
      const newAsOf: AsOf = asOf.next(Term.DAILY);

      expect(asOf.toString()).toBe('2000-01-01');
      expect(newAsOf.toString()).toBe('2000-01-02');
    });

    it('term.WEEKLY', () => {
      expect.assertions(2);

      const asOf: AsOf = AsOf.ofString('2000-01-01');
      const newAsOf: AsOf = asOf.next(Term.WEEKLY);

      expect(asOf.toString()).toBe('2000-01-01');
      expect(newAsOf.toString()).toBe('2000-01-08');
    });

    it('term.MONTHLY', () => {
      expect.assertions(2);

      const asOf: AsOf = AsOf.ofString('2000-01-01');
      const newAsOf: AsOf = asOf.next(Term.MONTHLY);

      expect(asOf.toString()).toBe('2000-01-01');
      expect(newAsOf.toString()).toBe('2000-02-01');
    });

    it('term.QUARTERLY', () => {
      expect.assertions(2);

      const asOf: AsOf = AsOf.ofString('2000-01-01');
      const newAsOf: AsOf = asOf.next(Term.QUARTERLY);

      expect(asOf.toString()).toBe('2000-01-01');
      expect(newAsOf.toString()).toBe('2000-04-01');
    });

    it('term.ANNUAL', () => {
      expect.assertions(2);

      const asOf: AsOf = AsOf.ofString('2000-01-01');
      const newAsOf: AsOf = asOf.next(Term.ANNUAL);

      expect(asOf.toString()).toBe('2000-01-01');
      expect(newAsOf.toString()).toBe('2001-01-01');
    });

    it('all', () => {
      expect.assertions(5);

      const asOf: AsOf = AsOf.ofString('2000-01-01');
      const allTerm: Terms = Terms.all();

      allTerm.map<void>((term: Term) => {
        expect(() => {
          const t: Nullable<Term> = allTerm.get(term.getTermID());

          asOf.next(t as Term);
        }).not.toThrow(AsOfError);
      });
    });

    it('throws AsOfError because this situation is not considered', () => {
      expect.assertions(1);

      const asOf: AsOf = AsOf.ofString('2000-01-01');
      const fakeTerm: MockTerm = new MockTerm();

      expect(() => {
        asOf.next(fakeTerm);
      }).toThrow(AsOfError);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      expect.assertions(1);

      const asOf: string = '2000-01-01';
      const a: AsOf = AsOf.ofString(asOf);

      expect(a.toString()).toBe(asOf);
    });
  });
});
