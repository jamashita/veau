import sinon, { SinonStub } from 'sinon';
import { Absent } from '../../General/Quantum/Absent';
import { MockTerm } from '../Mock/MockTerm';
import { Term } from '../Term';
import { Terms } from '../Terms';

describe('Terms', () => {
  describe('all', () => {
    it('is singleton instance', () => {
      expect(Terms.all()).toBe(Terms.all());
    });

    it('\'s length is 5', () => {
      expect(Terms.all().size()).toBe(5);
    });
  });

  describe('get', () => {
    it('returns Term instance at the correct index', () => {
      const terms: Terms = Terms.all();

      expect(terms.get(0).get()).toBe(Term.DAILY);
      expect(terms.get(1).get()).toBe(Term.WEEKLY);
      expect(terms.get(2).get()).toBe(Term.MONTHLY);
      expect(terms.get(3).get()).toBe(Term.QUARTERLY);
      expect(terms.get(4).get()).toBe(Term.ANNUAL);
    });

    it('returns Absent when the index is out of range', () => {
      const terms: Terms = Terms.all();

      expect(terms.get(-1)).toBeInstanceOf(Absent);
      expect(terms.get(5)).toBeInstanceOf(Absent);
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

      expect(terms.toString()).toBe(`${Term.DAILY.toString()}, ${Term.WEEKLY.toString()}, ${Term.MONTHLY.toString()}, ${Term.QUARTERLY.toString()}, ${Term.ANNUAL.toString()}`);
    });
  });
});
