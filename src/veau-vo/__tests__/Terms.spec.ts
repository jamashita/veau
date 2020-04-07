import { None } from '../../veau-general/Optional/None';
import { Term } from '../Term';
import { Terms } from '../Terms';

describe('Terms', () => {
  describe('get', () => {
    it('returns Term instance at the correct index', () => {
      const terms: Terms = Terms.all();

      expect(terms.get(0).get()).toEqual(Term.DAILY);
      expect(terms.get(1).get()).toEqual(Term.WEEKLY);
      expect(terms.get(2).get()).toEqual(Term.MONTHLY);
      expect(terms.get(3).get()).toEqual(Term.QUARTERLY);
      expect(terms.get(4).get()).toEqual(Term.ANNUAL);
    });

    it('returns None when the index is out of range', () => {
      const terms: Terms = Terms.all();

      expect(terms.get(-1)).toBeInstanceOf(None);
      expect(terms.get(5)).toBeInstanceOf(None);
    });
  });

  describe('contains', () => {
    it('returns true if the element exists in the Terms', () => {
      const terms: Terms = Terms.all();
      const fakeTerm: Term = {} as Term;
      expect(terms.contains(Term.ANNUAL)).toEqual(true);
      expect(terms.contains(Term.QUARTERLY)).toEqual(true);
      expect(terms.contains(Term.MONTHLY)).toEqual(true);
      expect(terms.contains(Term.WEEKLY)).toEqual(true);
      expect(terms.contains(Term.DAILY)).toEqual(true);
      expect(terms.contains(fakeTerm)).toEqual(false);
    });
  });

  describe('isEmpty', () => {
    it('always returns false because only 1 terms instance has some elements', () => {
      const terms: Terms = Terms.all();

      expect(terms.isEmpty()).toEqual(false);
    });
  });

  describe('equals', () => {
    it('returns true because the instances are quite same', () => {
      const terms1: Terms = Terms.all();
      const terms2: Terms = Terms.all();

      expect(terms1.equals(terms2)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const terms: Terms = Terms.all();

      expect(terms.toString()).toEqual(`${Term.DAILY.toString()}, ${Term.WEEKLY.toString()}, ${Term.MONTHLY.toString()}, ${Term.QUARTERLY.toString()}, ${Term.ANNUAL.toString()}`);
    });
  });
});
