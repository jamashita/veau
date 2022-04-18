import { UUID } from '@jamashita/anden-uuid';
import { VeauAccountError } from '../VeauAccountError';
import { VeauAccountID } from '../VeauAccountID';

describe('VeauAccountID', () => {
  describe('of', () => {
    it('normal case', () => {
      const uuid: UUID = UUID.v4();

      const veauAccountID: VeauAccountID = VeauAccountID.of(uuid);

      expect(veauAccountID.get()).toBe(uuid);
    });
  });

  describe('ofString', () => {
    it('normal case', () => {
      const uuid: UUID = UUID.v4();

      const veauAccountID: VeauAccountID = VeauAccountID.ofString(uuid.get());

      expect(veauAccountID.get().equals(uuid)).toBe(true);
    });

    it('returns Dead when uuid length string is not given', () => {
      expect(() => {
        VeauAccountID.ofString('cinq');
      }).toThrow(VeauAccountError);
    });
  });

  describe('generate', () => {
    it('always gives UUID length string', () => {
      for (let i: number = 0; i < 100; i++) {
        expect(VeauAccountID.generate().get().get()).toHaveLength(UUID.size());
      }
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      const veauAccountID: VeauAccountID = VeauAccountID.of(UUID.v4());

      expect(veauAccountID.equals(null)).toBe(false);
      expect(veauAccountID.equals(undefined)).toBe(false);
      expect(veauAccountID.equals('')).toBe(false);
      expect(veauAccountID.equals('123')).toBe(false);
      expect(veauAccountID.equals('abcd')).toBe(false);
      expect(veauAccountID.equals(123)).toBe(false);
      expect(veauAccountID.equals(0)).toBe(false);
      expect(veauAccountID.equals(-12)).toBe(false);
      expect(veauAccountID.equals(0.3)).toBe(false);
      expect(veauAccountID.equals(false)).toBe(false);
      expect(veauAccountID.equals(true)).toBe(false);
      expect(veauAccountID.equals(Symbol('p'))).toBe(false);
      expect(veauAccountID.equals(20n)).toBe(false);
      expect(veauAccountID.equals({})).toBe(false);
      expect(veauAccountID.equals([])).toBe(false);
      expect(veauAccountID.equals(Object.create(null))).toBe(false);
    });

    it('returns true if the property is the same', () => {
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
});
