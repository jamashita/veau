import { Superposition, UUID } from 'publikum';
import { TermError } from '../Error/TermError';
import { Term } from '../Term';
import { TermID } from '../TermID';

describe('Term', () => {
  describe('of', () => {
    it('normal case', () => {
      expect(Term.of(UUID.of('34b53215-a990-44d7-926e-30d6a53611d9')).get()).toBe(Term.DAILY);
      expect(Term.of(UUID.of('e194c8ed-f53b-4ac5-b506-a06900e7053c')).get()).toBe(Term.WEEKLY);
      expect(Term.of(UUID.of('5a60eb2e-64f4-4d18-b8c1-34d3fa6a6262')).get()).toBe(Term.MONTHLY);
      expect(Term.of(UUID.of('fbfe34f4-9757-4133-8353-c9a4bf3479d3')).get()).toBe(Term.QUARTERLY);
      expect(Term.of(UUID.of('96f0d8a0-a136-4fb1-bc07-22dad6b8a21c')).get()).toBe(Term.ANNUAL);
    });

    it('returns Dead when the id is out of range', () => {
      for (let i: number = 0; i < 100; i++) {
        const superposition: Superposition<Term, TermError> = Term.of(UUID.v4());

        expect(superposition.isDead()).toBe(true);
      }
    });
  });

  describe('of', () => {
    it('normal case', () => {
      expect(Term.ofTermID(Term.DAILY.getTermID()).get()).toBe(Term.DAILY);
      expect(Term.ofTermID(Term.WEEKLY.getTermID()).get()).toBe(Term.WEEKLY);
      expect(Term.ofTermID(Term.MONTHLY.getTermID()).get()).toBe(Term.MONTHLY);
      expect(Term.ofTermID(Term.QUARTERLY.getTermID()).get()).toBe(Term.QUARTERLY);
      expect(Term.ofTermID(Term.ANNUAL.getTermID()).get()).toBe(Term.ANNUAL);
    });

    it('returns Dead when else', () => {
      for (let i: number = 0; i < 100; i++) {
        const superposition: Superposition<Term, TermError> = Term.ofTermID(TermID.of(UUID.v4()));

        expect(superposition.isDead()).toBe(true);
      }
    });
  });

  describe('ofString', () => {
    it('normal case', () => {
      expect(Term.ofString('34b53215-a990-44d7-926e-30d6a53611d9').get()).toBe(Term.DAILY);
      expect(Term.ofString('e194c8ed-f53b-4ac5-b506-a06900e7053c').get()).toBe(Term.WEEKLY);
      expect(Term.ofString('5a60eb2e-64f4-4d18-b8c1-34d3fa6a6262').get()).toBe(Term.MONTHLY);
      expect(Term.ofString('fbfe34f4-9757-4133-8353-c9a4bf3479d3').get()).toBe(Term.QUARTERLY);
      expect(Term.ofString('96f0d8a0-a136-4fb1-bc07-22dad6b8a21c').get()).toBe(Term.ANNUAL);
    });

    it('returns Dead when else', () => {
      expect(Term.ofString('deux').isDead()).toBe(true);
      expect(Term.ofString('six').isDead()).toBe(true);
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

      expect(term1.toString()).toBe('34b53215-a990-44d7-926e-30d6a53611d9 DAILY');
      expect(term2.toString()).toBe('e194c8ed-f53b-4ac5-b506-a06900e7053c WEEKLY');
      expect(term3.toString()).toBe('5a60eb2e-64f4-4d18-b8c1-34d3fa6a6262 MONTHLY');
      expect(term4.toString()).toBe('fbfe34f4-9757-4133-8353-c9a4bf3479d3 QUARTERLY');
      expect(term5.toString()).toBe('96f0d8a0-a136-4fb1-bc07-22dad6b8a21c ANNUAL');
    });
  });
});
