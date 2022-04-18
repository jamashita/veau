import { UUID } from '@jamashita/anden-uuid';
import { Term } from '../Term';
import { TermError } from '../TermError';
import { TermID } from '../TermID';

describe('Term', () => {
  describe('of', () => {
    it('normal case', () => {
      expect(Term.of(UUID.of('34b53215-a990-44d7-926e-30d6a53611d9'))).toBe(Term.DAILY);
      expect(Term.of(UUID.of('e194c8ed-f53b-4ac5-b506-a06900e7053c'))).toBe(Term.WEEKLY);
      expect(Term.of(UUID.of('5a60eb2e-64f4-4d18-b8c1-34d3fa6a6262'))).toBe(Term.MONTHLY);
      expect(Term.of(UUID.of('fbfe34f4-9757-4133-8353-c9a4bf3479d3'))).toBe(Term.QUARTERLY);
      expect(Term.of(UUID.of('96f0d8a0-a136-4fb1-bc07-22dad6b8a21c'))).toBe(Term.ANNUAL);
    });

    it('returns Dead when the id is out of range', () => {
      for (let i: number = 0; i < 100; i++) {
        expect(() => {
          Term.of(UUID.v4());
        }).toThrow(TermError);
      }
    });
  });

  describe('ofTermID', () => {
    it('normal case', () => {
      expect(Term.ofTermID(Term.DAILY.getTermID())).toBe(Term.DAILY);
      expect(Term.ofTermID(Term.WEEKLY.getTermID())).toBe(Term.WEEKLY);
      expect(Term.ofTermID(Term.MONTHLY.getTermID())).toBe(Term.MONTHLY);
      expect(Term.ofTermID(Term.QUARTERLY.getTermID())).toBe(Term.QUARTERLY);
      expect(Term.ofTermID(Term.ANNUAL.getTermID())).toBe(Term.ANNUAL);
    });

    it('returns Dead when else', () => {
      for (let i: number = 0; i < 100; i++) {
        expect(() => {
          Term.ofTermID(TermID.of(UUID.v4()));
        }).toThrow(TermError);
      }
    });
  });

  describe('ofString', () => {
    it('normal case', () => {
      expect(Term.ofString('34b53215-a990-44d7-926e-30d6a53611d9')).toBe(Term.DAILY);
      expect(Term.ofString('e194c8ed-f53b-4ac5-b506-a06900e7053c')).toBe(Term.WEEKLY);
      expect(Term.ofString('5a60eb2e-64f4-4d18-b8c1-34d3fa6a6262')).toBe(Term.MONTHLY);
      expect(Term.ofString('fbfe34f4-9757-4133-8353-c9a4bf3479d3')).toBe(Term.QUARTERLY);
      expect(Term.ofString('96f0d8a0-a136-4fb1-bc07-22dad6b8a21c')).toBe(Term.ANNUAL);
    });

    it('returns Dead when else', () => {
      expect(() => {
        Term.ofString('deux');
      }).toThrow(TermError);
      expect(() => {
        Term.ofString('six');
      }).toThrow(TermError);
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      const term: Term = Term.ANNUAL;

      expect(term.equals(null)).toBe(false);
      expect(term.equals(undefined)).toBe(false);
      expect(term.equals('')).toBe(false);
      expect(term.equals('123')).toBe(false);
      expect(term.equals('abcd')).toBe(false);
      expect(term.equals(123)).toBe(false);
      expect(term.equals(0)).toBe(false);
      expect(term.equals(-12)).toBe(false);
      expect(term.equals(0.3)).toBe(false);
      expect(term.equals(false)).toBe(false);
      expect(term.equals(true)).toBe(false);
      expect(term.equals(Symbol('p'))).toBe(false);
      expect(term.equals(20n)).toBe(false);
      expect(term.equals({})).toBe(false);
      expect(term.equals([])).toBe(false);
      expect(term.equals(Object.create(null))).toBe(false);
    });

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
});
