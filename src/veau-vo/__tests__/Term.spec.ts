import sinon, { SinonSpy } from 'sinon';
import { TermError } from '../../veau-error/TermError';
import { Try } from '../../veau-general/Try/Try';
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
      expect(Term.of(1).get()).toEqual(Term.DAILY);
      expect(Term.of(2).get()).toEqual(Term.WEEKLY);
      expect(Term.of(3).get()).toEqual(Term.MONTHLY);
      expect(Term.of(4).get()).toEqual(Term.QUARTERLY);
      expect(Term.of(5).get()).toEqual(Term.ANNUAL);
    });

    it('returns Failure when the id is out of range', () => {
      const trial1: Try<Term, TermError> = Term.of(-1);
      const trial2: Try<Term, TermError> = Term.of(0);
      const trial3: Try<Term, TermError> = Term.of(6);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();
      const spy5: SinonSpy = sinon.spy();
      const spy6: SinonSpy = sinon.spy();

      expect(trial1.isFailure()).toEqual(true);
      expect(trial2.isFailure()).toEqual(true);
      expect(trial2.isFailure()).toEqual(true);

      trial1.match<void>(() => {
        spy1();
      }, (err: TermError) => {
        spy2();
        expect(err).toBeInstanceOf(TermError);
      });
      trial2.match<void>(() => {
        spy3();
      }, (err: TermError) => {
        spy4();
        expect(err).toBeInstanceOf(TermError);
      });
      trial3.match<void>(() => {
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
});
