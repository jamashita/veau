import { UUID } from '@jamashita/anden-uuid';
import { StatsError } from '../StatsError';
import { StatsID } from '../StatsID';

describe('StatsID', () => {
  describe('of', () => {
    it('normal case', () => {
      const uuid: UUID = UUID.v4();

      const statsID: StatsID = StatsID.of(uuid);

      expect(statsID.get().get()).toBe(uuid.get());
    });
  });

  describe('ofString', () => {
    it('normal case', () => {
      const uuid: UUID = UUID.v4();

      const statsID: StatsID = StatsID.ofString(uuid.get());

      expect(statsID.get().equals(uuid)).toBe(true);
    });

    it('returns Dead when uuid length string is not given', () => {
      expect(() => {
        StatsID.ofString('trois');
      }).toThrow(StatsError);
    });
  });

  describe('generate', () => {
    it('always gives UUID length string', () => {
      for (let i: number = 0; i < 100; i++) {
        expect(StatsID.generate().get().get()).toHaveLength(UUID.size());
      }
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      const statsID: StatsID = StatsID.of(UUID.v4());

      expect(statsID.equals(null)).toBe(false);
      expect(statsID.equals(undefined)).toBe(false);
      expect(statsID.equals('')).toBe(false);
      expect(statsID.equals('123')).toBe(false);
      expect(statsID.equals('abcd')).toBe(false);
      expect(statsID.equals(123)).toBe(false);
      expect(statsID.equals(0)).toBe(false);
      expect(statsID.equals(-12)).toBe(false);
      expect(statsID.equals(0.3)).toBe(false);
      expect(statsID.equals(false)).toBe(false);
      expect(statsID.equals(true)).toBe(false);
      expect(statsID.equals(Symbol('p'))).toBe(false);
      expect(statsID.equals(20n)).toBe(false);
      expect(statsID.equals({})).toBe(false);
      expect(statsID.equals([])).toBe(false);
      expect(statsID.equals(Object.create(null))).toBe(false);
    });

    it('returns true if the property is the same', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const statsID1: StatsID = StatsID.of(uuid1);
      const statsID2: StatsID = StatsID.of(uuid2);
      const statsID3: StatsID = StatsID.of(uuid1);

      expect(statsID1.equals(statsID1)).toBe(true);
      expect(statsID1.equals(statsID2)).toBe(false);
      expect(statsID1.equals(statsID3)).toBe(true);
    });
  });
});
