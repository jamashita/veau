import sinon, { SinonSpy } from 'sinon';
import { TermError } from '../../Error/TermError';
import { Superposition } from '../../General/Superposition/Superposition';
import { Term } from '../Term';

// DONE
describe('Term', () => {
  describe('of', () => {
    it('normal case', () => {
      expect(Term.of(1).get()).toEqual(Term.DAILY);
      expect(Term.of(2).get()).toEqual(Term.WEEKLY);
      expect(Term.of(3).get()).toEqual(Term.MONTHLY);
      expect(Term.of(4).get()).toEqual(Term.QUARTERLY);
      expect(Term.of(5).get()).toEqual(Term.ANNUAL);
    });

    it('returns Failure when the id is out of range', () => {
      const superposition1: Superposition<Term, TermError> = Term.of(-1);
      const superposition2: Superposition<Term, TermError> = Term.of(0);
      const superposition3: Superposition<Term, TermError> = Term.of(6);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();
      const spy5: SinonSpy = sinon.spy();
      const spy6: SinonSpy = sinon.spy();

      expect(superposition1.isFailure()).toEqual(true);
      expect(superposition2.isFailure()).toEqual(true);
      expect(superposition2.isFailure()).toEqual(true);

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

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
      expect(spy3.called).toEqual(false);
      expect(spy4.called).toEqual(true);
      expect(spy5.called).toEqual(false);
      expect(spy6.called).toEqual(true);
    });
  });

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
});
