import { UUID } from '@jamashita/anden-uuid';
import { VeauAccountError } from '../Error/VeauAccountError';
import { VeauAccountID } from '../VeauAccountID';

describe('VeauAccountID', () => {
  describe('of', () => {
    it('normal case', () => {
      expect.assertions(1);

      const uuid: UUID = UUID.v4();

      const veauAccountID: VeauAccountID = VeauAccountID.of(uuid);

      expect(veauAccountID.get()).toBe(uuid);
    });
  });

  describe('ofString', () => {
    it('normal case', () => {
      expect.assertions(1);

      const uuid: UUID = UUID.v4();

      const veauAccountID: VeauAccountID = VeauAccountID.ofString(uuid.get());

      expect(veauAccountID.get().equals(uuid)).toBe(true);
    });

    it('returns Dead when uuid length string is not given', () => {
      expect.assertions(1);

      expect(() => {
        VeauAccountID.ofString('cinq');
      }).toThrow(VeauAccountError);
    });
  });

  describe('generate', () => {
    it('always gives UUID length string', () => {
      expect.assertions(100);

      for (let i: number = 0; i < 100; i++) {
        expect(VeauAccountID.generate().get().get()).toHaveLength(UUID.size());
      }
    });
  });

  describe('equals', () => {
    it('returns true if the property is the same', () => {
      expect.assertions(3);

      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const veauAccountID1: VeauAccountID = VeauAccountID.of(uuid1);
      const veauAccountID2: VeauAccountID = VeauAccountID.of(uuid2);
      const veauAccountID3: VeauAccountID = VeauAccountID.of(uuid1);

      expect(veauAccountID1.equals(veauAccountID1)).toBe(true);
      expect(veauAccountID1.equals(veauAccountID2)).toBe(false);
      expect(veauAccountID1.equals(veauAccountID3)).toBe(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      expect.assertions(1);

      const uuid: UUID = UUID.v4();
      const veauAccountID: VeauAccountID = VeauAccountID.of(uuid);

      expect(veauAccountID.toString()).toBe(uuid.toString());
    });
  });
});
