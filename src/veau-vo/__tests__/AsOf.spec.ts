import 'jest';
import { RuntimeError } from '../../veau-general/RuntimeError';
import { AsOf } from '../AsOf';
import { Term } from '../Term';

describe('AsOf', () => {
  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const asOf1: AsOf = AsOf.ofString('2000-01-01 00:00:00');
      const asOf2: AsOf = AsOf.ofString('2000-01-02 00:00:00');
      const asOf3: AsOf = AsOf.ofString('2000-01-01 00:00:00');

      expect(asOf1.equals(asOf1)).toEqual(true);
      expect(asOf1.equals(asOf2)).toEqual(false);
      expect(asOf1.equals(asOf3)).toEqual(true);
    });
  });

  describe('getString', () => {
    it('normal case', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01');

      expect(asOf.getString()).toEqual('2000-01-01');
    });
  });

  describe('isBefore', () => {
    it('returns true if the value is before than the other', () => {
      const asOf1: AsOf = AsOf.ofString('2000-01-02 00:00:00');
      const asOf2: AsOf = AsOf.ofString('2000-01-03 00:00:00');
      const asOf3: AsOf = AsOf.ofString('2000-01-04 00:00:00');

      expect(asOf2.isBefore(asOf1)).toEqual(false);
      expect(asOf2.isBefore(asOf2)).toEqual(false);
      expect(asOf2.isBefore(asOf3)).toEqual(true);
    });
  });

  describe('isAfter', () => {
    it('returns true if the value is after than the other', () => {
      const asOf1: AsOf = AsOf.ofString('2000-01-02 00:00:00');
      const asOf2: AsOf = AsOf.ofString('2000-01-03 00:00:00');
      const asOf3: AsOf = AsOf.ofString('2000-01-04 00:00:00');

      expect(asOf2.isAfter(asOf1)).toEqual(true);
      expect(asOf2.isAfter(asOf2)).toEqual(false);
      expect(asOf2.isAfter(asOf3)).toEqual(false);
    });
  });

  describe('previous', () => {
    it('Term.DAILY', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01');
      const newAsOf: AsOf = asOf.previous(Term.DAILY);

      expect(asOf.getString()).toEqual('2000-01-01');
      expect(newAsOf.getString()).toEqual('1999-12-31');
    });

    it('Term.WEEKLY', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01');
      const newAsOf: AsOf = asOf.previous(Term.WEEKLY);

      expect(asOf.getString()).toEqual('2000-01-01');
      expect(newAsOf.getString()).toEqual('1999-12-25');
    });

    it('Term.MONTHLY', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01');
      const newAsOf: AsOf = asOf.previous(Term.MONTHLY);

      expect(asOf.getString()).toEqual('2000-01-01');
      expect(newAsOf.getString()).toEqual('1999-12-01');
    });

    it('Term.QUARTERLY', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01');
      const newAsOf: AsOf = asOf.previous(Term.QUARTERLY);

      expect(asOf.getString()).toEqual('2000-01-01');
      expect(newAsOf.getString()).toEqual('1999-10-01');
    });

    it('Term.ANNUAL', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01');
      const newAsOf: AsOf = asOf.previous(Term.ANNUAL);

      expect(asOf.getString()).toEqual('2000-01-01');
      expect(newAsOf.getString()).toEqual('1999-01-01');
    });
  });

  describe('next', () => {
    it('Term.DAILY', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01');
      const newAsOf: AsOf = asOf.next(Term.DAILY);

      expect(asOf.getString()).toEqual('2000-01-01');
      expect(newAsOf.getString()).toEqual('2000-01-02');
    });

    it('Term.WEEKLY', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01');
      const newAsOf: AsOf = asOf.next(Term.WEEKLY);

      expect(asOf.getString()).toEqual('2000-01-01');
      expect(newAsOf.getString()).toEqual('2000-01-08');
    });

    it('Term.MONTHLY', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01');
      const newAsOf: AsOf = asOf.next(Term.MONTHLY);

      expect(asOf.getString()).toEqual('2000-01-01');
      expect(newAsOf.getString()).toEqual('2000-02-01');
    });

    it('Term.QUARTERLY', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01');
      const newAsOf: AsOf = asOf.next(Term.QUARTERLY);

      expect(asOf.getString()).toEqual('2000-01-01');
      expect(newAsOf.getString()).toEqual('2000-04-01');
    });

    it('Term.ANNUAL', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01');
      const newAsOf: AsOf = asOf.next(Term.ANNUAL);

      expect(asOf.getString()).toEqual('2000-01-01');
      expect(newAsOf.getString()).toEqual('2001-01-01');
    });
  });

  describe('ofString', () => {
    it('normal case', () => {
      expect(() => {
        AsOf.ofString('2000-01-01');
      }).not.toThrow(RuntimeError);

      expect(() => {
        AsOf.ofString('2000-01-01 00:00:00');
      }).not.toThrow(RuntimeError);
    });

    it('will throw RuntimeError because the string format is not compatible to date time', () => {
      expect(() => {
        AsOf.ofString('deux mille');
      }).toThrow(RuntimeError);

      expect(() => {
        AsOf.ofString('dos mil');
      }).toThrow(RuntimeError);
    });
  });
});
