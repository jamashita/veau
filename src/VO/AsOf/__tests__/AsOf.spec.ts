import { Schrodinger, Superposition } from '@jamashita/publikum-monad';
import { Nullable } from '@jamashita/publikum-type';

import { MockTerm } from '../../Term/Mock/MockTerm';
import { Term } from '../../Term/Term';
import { Terms } from '../../Term/Terms';
import { AsOf } from '../AsOf';
import { AsOfError } from '../Error/AsOfError';

describe('AsOf', () => {
  describe('ofString', () => {
    it('normal case', async () => {
      const superposition1: Superposition<AsOf, AsOfError> = AsOf.ofString('2000-01-01');
      const superposition2: Superposition<AsOf, AsOfError> = AsOf.ofString('2000-01-01');
      const schrodinger1: Schrodinger<AsOf, AsOfError> = await superposition1.terminate();
      const schrodinger2: Schrodinger<AsOf, AsOfError> = await superposition2.terminate();

      expect(schrodinger1.isAlive()).toBe(true);
      expect(schrodinger2.isAlive()).toBe(true);
    });

    it('will return Dead because the string format is not compatible to date time', async () => {
      const superposition1: Superposition<AsOf, AsOfError> = AsOf.ofString('deux mille');
      const superposition2: Superposition<AsOf, AsOfError> = AsOf.ofString('dos mil');
      const superposition3: Superposition<AsOf, AsOfError> = AsOf.ofString('2000-01-01 01:02:03');
      const schrodinger1: Schrodinger<AsOf, AsOfError> = await superposition1.terminate();
      const schrodinger2: Schrodinger<AsOf, AsOfError> = await superposition2.terminate();
      const schrodinger3: Schrodinger<AsOf, AsOfError> = await superposition3.terminate();

      expect(schrodinger1.isDead()).toBe(true);
      expect(() => {
        schrodinger1.get();
      }).toThrow(AsOfError);
      expect(schrodinger2.isDead()).toBe(true);
      expect(() => {
        schrodinger2.get();
      }).toThrow(AsOfError);
      expect(schrodinger3.isDead()).toBe(true);
      expect(() => {
        schrodinger3.get();
      }).toThrow(AsOfError);
    });
  });

  describe('format', () => {
    it('returns YYYY-MM-DD', () => {
      expect(AsOf.format()).toBe('YYYY-MM-DD');
    });
  });

  describe('equals', () => {
    it('returns true if both properties are the same', async () => {
      const asOf1: AsOf = await AsOf.ofString('2000-01-01').get();
      const asOf2: AsOf = await AsOf.ofString('2000-01-02').get();
      const asOf3: AsOf = await AsOf.ofString('2000-01-01').get();

      expect(asOf1.equals(asOf1)).toBe(true);
      expect(asOf1.equals(asOf2)).toBe(false);
      expect(asOf1.equals(asOf3)).toBe(true);
    });
  });

  describe('isBefore', () => {
    it('returns true if the value is before than the other', async () => {
      const asOf1: AsOf = await AsOf.ofString('2000-01-02').get();
      const asOf2: AsOf = await AsOf.ofString('2000-01-03').get();
      const asOf3: AsOf = await AsOf.ofString('2000-01-04').get();

      expect(asOf2.isBefore(asOf1)).toBe(false);
      expect(asOf2.isBefore(asOf2)).toBe(false);
      expect(asOf2.isBefore(asOf3)).toBe(true);
    });
  });

  describe('isAfter', () => {
    it('returns true if the value is after than the other', async () => {
      const asOf1: AsOf = await AsOf.ofString('2000-01-02').get();
      const asOf2: AsOf = await AsOf.ofString('2000-01-03').get();
      const asOf3: AsOf = await AsOf.ofString('2000-01-04').get();

      expect(asOf2.isAfter(asOf1)).toBe(true);
      expect(asOf2.isAfter(asOf2)).toBe(false);
      expect(asOf2.isAfter(asOf3)).toBe(false);
    });
  });

  describe('previous', () => {
    it('Term.DAILY', async () => {
      const asOf: AsOf = await AsOf.ofString('2000-01-01').get();
      const newAsOf: AsOf = asOf.previous(Term.DAILY);

      expect(asOf.toString()).toBe('2000-01-01');
      expect(newAsOf.toString()).toBe('1999-12-31');
    });

    it('Term.WEEKLY', async () => {
      const asOf: AsOf = await AsOf.ofString('2000-01-01').get();
      const newAsOf: AsOf = asOf.previous(Term.WEEKLY);

      expect(asOf.toString()).toBe('2000-01-01');
      expect(newAsOf.toString()).toBe('1999-12-25');
    });

    it('Term.MONTHLY', async () => {
      const asOf: AsOf = await AsOf.ofString('2000-01-01').get();
      const newAsOf: AsOf = asOf.previous(Term.MONTHLY);

      expect(asOf.toString()).toBe('2000-01-01');
      expect(newAsOf.toString()).toBe('1999-12-01');
    });

    it('Term.QUARTERLY', async () => {
      const asOf: AsOf = await AsOf.ofString('2000-01-01').get();
      const newAsOf: AsOf = asOf.previous(Term.QUARTERLY);

      expect(asOf.toString()).toBe('2000-01-01');
      expect(newAsOf.toString()).toBe('1999-10-01');
    });

    it('Term.ANNUAL', async () => {
      const asOf: AsOf = await AsOf.ofString('2000-01-01').get();
      const newAsOf: AsOf = asOf.previous(Term.ANNUAL);

      expect(asOf.toString()).toBe('2000-01-01');
      expect(newAsOf.toString()).toBe('1999-01-01');
    });

    it('all', async () => {
      const asOf: AsOf = await AsOf.ofString('2000-01-01').get();
      const allTerm: Terms = Terms.all();

      allTerm.map<void>((term: Term) => {
        expect(() => {
          const t: Nullable<Term> = allTerm.get(term.getTermID());

          asOf.previous(t as Term);
        }).not.toThrow(AsOfError);
      });
    });

    it('throws AsOfError because this situation is not considered', async () => {
      const asOf: AsOf = await AsOf.ofString('2000-01-01').get();
      const fakeTerm: MockTerm = new MockTerm();

      expect(() => {
        asOf.previous(fakeTerm);
      }).toThrow(AsOfError);
    });
  });

  describe('next', () => {
    it('Term.DAILY', async () => {
      const asOf: AsOf = await AsOf.ofString('2000-01-01').get();
      const newAsOf: AsOf = asOf.next(Term.DAILY);

      expect(asOf.toString()).toBe('2000-01-01');
      expect(newAsOf.toString()).toBe('2000-01-02');
    });

    it('Term.WEEKLY', async () => {
      const asOf: AsOf = await AsOf.ofString('2000-01-01').get();
      const newAsOf: AsOf = asOf.next(Term.WEEKLY);

      expect(asOf.toString()).toBe('2000-01-01');
      expect(newAsOf.toString()).toBe('2000-01-08');
    });

    it('Term.MONTHLY', async () => {
      const asOf: AsOf = await AsOf.ofString('2000-01-01').get();
      const newAsOf: AsOf = asOf.next(Term.MONTHLY);

      expect(asOf.toString()).toBe('2000-01-01');
      expect(newAsOf.toString()).toBe('2000-02-01');
    });

    it('Term.QUARTERLY', async () => {
      const asOf: AsOf = await AsOf.ofString('2000-01-01').get();
      const newAsOf: AsOf = asOf.next(Term.QUARTERLY);

      expect(asOf.toString()).toBe('2000-01-01');
      expect(newAsOf.toString()).toBe('2000-04-01');
    });

    it('Term.ANNUAL', async () => {
      const asOf: AsOf = await AsOf.ofString('2000-01-01').get();
      const newAsOf: AsOf = asOf.next(Term.ANNUAL);

      expect(asOf.toString()).toBe('2000-01-01');
      expect(newAsOf.toString()).toBe('2001-01-01');
    });

    it('all', async () => {
      const asOf: AsOf = await AsOf.ofString('2000-01-01').get();
      const allTerm: Terms = Terms.all();

      allTerm.map<void>((term: Term) => {
        expect(() => {
          const t: Nullable<Term> = allTerm.get(term.getTermID());

          asOf.next(t as Term);
        }).not.toThrow(AsOfError);
      });
    });

    it('throws AsOfError because this situation is not considered', async () => {
      const asOf: AsOf = await AsOf.ofString('2000-01-01').get();
      const fakeTerm: MockTerm = new MockTerm();

      expect(() => {
        asOf.next(fakeTerm);
      }).toThrow(AsOfError);
    });
  });

  describe('toString', () => {
    it('normal case', async () => {
      const asOf: string = '2000-01-01';
      const a: AsOf = await AsOf.ofString(asOf).get();

      expect(a.toString()).toBe(asOf);
    });
  });
});
