import 'jest';
import { RuntimeError } from '../../veau-general/RuntimeError';
import { Term } from '../Term';

describe('Term', () => {
  describe('equals', () => {
    it('returns true if the objects are the same', () => {
      const term1: Term = Term.DAILY;
      const term2: Term = Term.WEEKLY;
      const term3: Term = Term.MONTHLY;
      const term4: Term = Term.QUARTERLY;
      const term5: Term = Term.ANNUAL;

      expect(term1.equals(term1)).toEqual(true);
      expect(term1.equals(term2)).toEqual(false);
      expect(term1.equals(term3)).toEqual(false);
      expect(term1.equals(term4)).toEqual(false);
      expect(term1.equals(term5)).toEqual(false);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const term1: Term = Term.DAILY;
      const term2: Term = Term.WEEKLY;
      const term3: Term = Term.MONTHLY;
      const term4: Term = Term.QUARTERLY;
      const term5: Term = Term.ANNUAL;

      expect(term1.toString()).toEqual('DAILY');
      expect(term2.toString()).toEqual('WEEKLY');
      expect(term3.toString()).toEqual('MONTHLY');
      expect(term4.toString()).toEqual('QUARTERLY');
      expect(term5.toString()).toEqual('ANNUAL');
    });
  });

  describe('of', () => {
    it('normal case', () => {
      expect(Term.of(1)).toEqual(Term.DAILY);
      expect(Term.of(2)).toEqual(Term.WEEKLY);
      expect(Term.of(3)).toEqual(Term.MONTHLY);
      expect(Term.of(4)).toEqual(Term.QUARTERLY);
      expect(Term.of(5)).toEqual(Term.ANNUAL);
    });

    it('throws RuntimeError', () => {
      expect(() => {
        Term.of(-1);
      }).toThrow(RuntimeError);
      expect(() => {
        Term.of(0);
      }).toThrow(RuntimeError);
      expect(() => {
        Term.of(6);
      }).toThrow(RuntimeError);
    });
  });
});
