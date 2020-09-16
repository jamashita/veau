import { UUID } from '@jamashita/publikum-uuid';
import { TermError } from '../Error/TermError';
import { TermID } from '../TermID';

describe('TermID', () => {
  describe('of', () => {
    it('normal case', () => {
      expect.assertions(1);

      const uuid: UUID = UUID.v4();

      const termID: TermID = TermID.of(uuid);

      expect(termID.get().equals(uuid)).toBe(true);
    });
  });

  describe('ofString', () => {
    it('normal case', () => {
      expect.assertions(1);

      const uuid: UUID = UUID.v4();

      const termID: TermID = TermID.ofString(uuid.get());

      expect(termID.get().equals(uuid)).toBe(true);
    });

    it('returns Dead when uuid length string is not given', () => {
      expect.assertions(1);

      expect(() => {
        TermID.ofString('cinq');
      }).toThrow(TermError);
    });
  });

  describe('equals', () => {
    it('returns true if the property is the same', () => {
      expect.assertions(3);

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

  describe('toString', () => {
    it('returns the original string', () => {
      expect.assertions(1);

      const uuid: UUID = UUID.v4();
      const termID: TermID = TermID.of(uuid);

      expect(termID.toString()).toBe(uuid.toString());
    });
  });
});
