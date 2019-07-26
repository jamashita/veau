import 'jest';
import { NoSuchElementError } from '../../../veau-error/NoSuchElementError';
import { Term } from '../../Term';
import { Terms } from '../Terms';

describe('Terms', () => {
  describe('get', () => {
    it('returns Term instance at the correct index', () => {
      const terms: Terms = Terms.all();

      expect(terms.get(0)).toEqual(Term.DAILY);
      expect(terms.get(1)).toEqual(Term.WEEKLY);
      expect(terms.get(2)).toEqual(Term.MONTHLY);
      expect(terms.get(3)).toEqual(Term.QUARTERLY);
      expect(terms.get(4)).toEqual(Term.ANNUAL);
    });

    it('throws error when the index is out of range', () => {
      const terms: Terms = Terms.all();

      expect(() => {
        terms.get(-1);
      }).toThrow(NoSuchElementError);
      expect(() => {
        terms.get(5);
      }).toThrow(NoSuchElementError);
    });
  });

  describe('equals', () => {
    it('returns true because the instances are quite same', () => {
      const terms1: Terms = Terms.all();
      const terms2: Terms = Terms.all();

      expect(terms1.equals(terms2)).toEqual(true);
    });
  });
});
