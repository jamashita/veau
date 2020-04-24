import { Superposition } from 'publikum';
import sinon, { SinonSpy } from 'sinon';
import { TermError } from '../../Error/TermError';
import { Term } from '../Term';

describe('Term', () => {
  describe('of', () => {
    it('normal case', () => {
      expect(Term.of(1).get()).toBe(Term.DAILY);
      expect(Term.of(2).get()).toBe(Term.WEEKLY);
      expect(Term.of(3).get()).toBe(Term.MONTHLY);
      expect(Term.of(4).get()).toBe(Term.QUARTERLY);
      expect(Term.of(5).get()).toBe(Term.ANNUAL);
    });

    it('returns Dead when the id is out of range', () => {
      const superposition1: Superposition<Term, TermError> = Term.of(-1);
      const superposition2: Superposition<Term, TermError> = Term.of(0);
      const superposition3: Superposition<Term, TermError> = Term.of(6);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();
      const spy5: SinonSpy = sinon.spy();
      const spy6: SinonSpy = sinon.spy();

      expect(superposition1.isDead()).toBe(true);
      expect(superposition2.isDead()).toBe(true);
      expect(superposition3.isDead()).toBe(true);

      superposition1.match<void>(() => {
        spy1();
      }, (err: TermError) => {
        spy2();
        expect(err).toBeInstanceOf(TermError);
      });
      superposition2.match<void>(() => {
        spy3();
      }, (err: TermError) => {
        spy4();
        expect(err).toBeInstanceOf(TermError);
      });
      superposition3.match<void>(() => {
        spy5();
      }, (err: TermError) => {
        spy6();
        expect(err).toBeInstanceOf(TermError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
      expect(spy5.called).toBe(false);
      expect(spy6.called).toBe(true);
    });
  });

  describe('getID', () => {
    it('normal case', () => {
      expect(Term.DAILY.getID()).toBe(1);
      expect(Term.WEEKLY.getID()).toBe(2);
      expect(Term.MONTHLY.getID()).toBe(3);
      expect(Term.QUARTERLY.getID()).toBe(4);
      expect(Term.ANNUAL.getID()).toBe(5);
    });
  });

  describe('getKey', () => {
    it('normal case', () => {
      expect(Term.DAILY.toString()).toBe(Term.DAILY.getKey());
      expect(Term.WEEKLY.toString()).toBe(Term.WEEKLY.getKey());
      expect(Term.MONTHLY.toString()).toBe(Term.MONTHLY.getKey());
      expect(Term.QUARTERLY.toString()).toBe(Term.QUARTERLY.getKey());
      expect(Term.ANNUAL.toString()).toBe(Term.ANNUAL.getKey());
    });
  });

  describe('equals', () => {
    it('returns true if the objects are the same', () => {
      const term1: Term = Term.DAILY;
      const term2: Term = Term.WEEKLY;
      const term3: Term = Term.MONTHLY;
      const term4: Term = Term.QUARTERLY;
      const term5: Term = Term.ANNUAL;

      expect(term1.equals(term1)).toBe(true);
      expect(term1.equals(term2)).toBe(false);
      expect(term1.equals(term3)).toBe(false);
      expect(term1.equals(term4)).toBe(false);
      expect(term1.equals(term5)).toBe(false);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const term1: Term = Term.DAILY;
      const term2: Term = Term.WEEKLY;
      const term3: Term = Term.MONTHLY;
      const term4: Term = Term.QUARTERLY;
      const term5: Term = Term.ANNUAL;

      expect(term1.toString()).toBe('DAILY');
      expect(term2.toString()).toBe('WEEKLY');
      expect(term3.toString()).toBe('MONTHLY');
      expect(term4.toString()).toBe('QUARTERLY');
      expect(term5.toString()).toBe('ANNUAL');
    });
  });
});
