import sinon, { SinonStub } from 'sinon';

import { MockTerm } from '../Mock/MockTerm';
import { MockTermID } from '../Mock/MockTermID';
import { Term } from '../Term';
import { Terms } from '../Terms';

describe('Terms', () => {
  describe('all', () => {
    it('is singleton instance', () => {
      expect(Terms.all()).toBe(Terms.all());
    });

    it('the length is 5', () => {
      expect(Terms.all().size()).toBe(5);
    });
  });

  describe('get', () => {
    it('returns Term instance at the correct index', () => {
      const terms: Terms = Terms.all();

      expect(terms.get(Term.DAILY.getTermID())).toBe(Term.DAILY);
      expect(terms.get(Term.WEEKLY.getTermID())).toBe(Term.WEEKLY);
      expect(terms.get(Term.MONTHLY.getTermID())).toBe(Term.MONTHLY);
      expect(terms.get(Term.QUARTERLY.getTermID())).toBe(Term.QUARTERLY);
      expect(terms.get(Term.ANNUAL.getTermID())).toBe(Term.ANNUAL);
    });

    it('returns null when the index is out of range', () => {
      const terms: Terms = Terms.all();

      expect(terms.get(new MockTermID())).toBe(null);
    });
  });

  describe('contains', () => {
    it('returns true if the element exists in the Terms', () => {
      const terms: Terms = Terms.all();
      const fakeTerm: MockTerm = new MockTerm();

      const stub: SinonStub = sinon.stub();

      fakeTerm.equals = stub;
      stub.returns(false);

      expect(terms.contains(Term.ANNUAL)).toBe(true);
      expect(terms.contains(Term.QUARTERLY)).toBe(true);
      expect(terms.contains(Term.MONTHLY)).toBe(true);
      expect(terms.contains(Term.WEEKLY)).toBe(true);
      expect(terms.contains(Term.DAILY)).toBe(true);
      expect(terms.contains(fakeTerm)).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('always returns false because only 1 terms instance has some elements', () => {
      expect(Terms.all().isEmpty()).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true because the instances are quite same', () => {
      expect(Terms.all()).toBe(Terms.all());
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const terms: Terms = Terms.all();

      expect(terms.toString()).toBe(
        `{${Term.DAILY.getTermID().toString()}: ${Term.DAILY.toString()}}, {${Term.WEEKLY.getTermID().toString()}: ${Term.WEEKLY.toString()}}, {${Term.MONTHLY.getTermID().toString()}: ${Term.MONTHLY.toString()}}, {${Term.QUARTERLY.getTermID().toString()}: ${Term.QUARTERLY.toString()}}, {${Term.ANNUAL.getTermID().toString()}: ${Term.ANNUAL.toString()}}`
      );
    });
  });
});
