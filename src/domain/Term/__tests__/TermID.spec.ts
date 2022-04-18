import { UUID } from '@jamashita/anden-uuid';
import { TermError } from '../TermError';
import { TermID } from '../TermID';

describe('TermID', () => {
  describe('of', () => {
    it('normal case', () => {
      const uuid: UUID = UUID.v4();

      const termID: TermID = TermID.of(uuid);

      expect(termID.get().equals(uuid)).toBe(true);
    });
  });

  describe('ofString', () => {
    it('normal case', () => {
      const uuid: UUID = UUID.v4();

      const termID: TermID = TermID.ofString(uuid.get());

      expect(termID.get().equals(uuid)).toBe(true);
    });

    it('returns Dead when uuid length string is not given', () => {
      expect(() => {
        TermID.ofString('cinq');
      }).toThrow(TermError);
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      const termID: TermID = TermID.of(UUID.v4());

      expect(termID.equals(null)).toBe(false);
      expect(termID.equals(undefined)).toBe(false);
      expect(termID.equals('')).toBe(false);
      expect(termID.equals('123')).toBe(false);
      expect(termID.equals('abcd')).toBe(false);
      expect(termID.equals(123)).toBe(false);
      expect(termID.equals(0)).toBe(false);
      expect(termID.equals(-12)).toBe(false);
      expect(termID.equals(0.3)).toBe(false);
      expect(termID.equals(false)).toBe(false);
      expect(termID.equals(true)).toBe(false);
      expect(termID.equals(Symbol('p'))).toBe(false);
      expect(termID.equals(20n)).toBe(false);
      expect(termID.equals({})).toBe(false);
      expect(termID.equals([])).toBe(false);
      expect(termID.equals(Object.create(null))).toBe(false);
    });

    it('returns true if the property is the same', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const termID1: TermID = TermID.of(uuid1);
      const termID2: TermID = TermID.of(uuid2);
      const termID3: TermID = TermID.of(uuid1);

      expect(termID1.equals(termID1)).toBe(true);
      expect(termID1.equals(termID2)).toBe(false);
      expect(termID1.equals(termID3)).toBe(true);
    });
  });
});
