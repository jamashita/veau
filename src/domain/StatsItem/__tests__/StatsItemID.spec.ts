import { UUID } from '@jamashita/anden-uuid';
import { StatsItemError } from '../StatsItemError';
import { StatsItemID } from '../StatsItemID';

describe('StatsItemID', () => {
  describe('of', () => {
    it('normal case', () => {
      const uuid: UUID = UUID.v4();

      const statsItemID: StatsItemID = StatsItemID.of(uuid);

      expect(statsItemID.get().get()).toBe(uuid.get());
    });
  });

  describe('ofString', () => {
    it('normal case', () => {
      const uuid: UUID = UUID.v4();

      const statsItemID: StatsItemID = StatsItemID.ofString(uuid.get());

      expect(statsItemID.get().equals(uuid)).toBe(true);
    });

    it('returns Dead when uuid length string is not given', () => {
      expect(() => {
        StatsItemID.ofString('quatre');
      }).toThrow(StatsItemError);
    });
  });

  describe('generate', () => {
    it('always gives UUID length string', () => {
      for (let i: number = 0; i < 100; i++) {
        expect(StatsItemID.generate().get().get()).toHaveLength(UUID.size());
      }
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      const statsItemID: StatsItemID = StatsItemID.of(UUID.v4());

      expect(statsItemID.equals(null)).toBe(false);
      expect(statsItemID.equals(undefined)).toBe(false);
      expect(statsItemID.equals('')).toBe(false);
      expect(statsItemID.equals('123')).toBe(false);
      expect(statsItemID.equals('abcd')).toBe(false);
      expect(statsItemID.equals(123)).toBe(false);
      expect(statsItemID.equals(0)).toBe(false);
      expect(statsItemID.equals(-12)).toBe(false);
      expect(statsItemID.equals(0.3)).toBe(false);
      expect(statsItemID.equals(false)).toBe(false);
      expect(statsItemID.equals(true)).toBe(false);
      expect(statsItemID.equals(Symbol('p'))).toBe(false);
      expect(statsItemID.equals(20n)).toBe(false);
      expect(statsItemID.equals({})).toBe(false);
      expect(statsItemID.equals([])).toBe(false);
      expect(statsItemID.equals(Object.create(null))).toBe(false);
    });

    it('returns true if the property is the same', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const statsItemID1: StatsItemID = StatsItemID.of(uuid1);
      const statsItemID2: StatsItemID = StatsItemID.of(uuid2);
      const statsItemID3: StatsItemID = StatsItemID.of(uuid1);

      expect(statsItemID1.equals(statsItemID1)).toBe(true);
      expect(statsItemID1.equals(statsItemID2)).toBe(false);
      expect(statsItemID1.equals(statsItemID3)).toBe(true);
    });
  });
});
