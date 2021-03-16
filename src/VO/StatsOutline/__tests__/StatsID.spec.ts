import { UUID } from '@jamashita/publikum-uuid';
import { StatsError } from '../Error/StatsError';
import { StatsID } from '../StatsID';

describe('StatsID', () => {
  describe('of', () => {
    it('normal case', () => {
      expect.assertions(1);

      const uuid: UUID = UUID.v4();

      const statsID: StatsID = StatsID.of(uuid);

      expect(statsID.get().get()).toBe(uuid.get());
    });
  });

  describe('ofString', () => {
    it('normal case', () => {
      expect.assertions(1);

      const uuid: UUID = UUID.v4();

      const statsID: StatsID = StatsID.ofString(uuid.get());

      expect(statsID.get().equals(uuid)).toBe(true);
    });

    it('returns Dead when uuid length string is not given', () => {
      expect.assertions(1);

      expect(() => {
        StatsID.ofString('trois');
      }).toThrow(StatsError);
    });
  });

  describe('generate', () => {
    it('always gives UUID length string', () => {
      expect.assertions(100);

      for (let i: number = 0; i < 100; i++) {
        expect(StatsID.generate().get().get()).toHaveLength(UUID.size());
      }
    });
  });

  describe('equals', () => {
    it('returns true if the property is the same', () => {
      expect.assertions(3);

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

  describe('toString', () => {
    it('returns the original string', () => {
      expect.assertions(1);

      const uuid: UUID = UUID.v4();
      const statsID: StatsID = StatsID.of(uuid);

      expect(statsID.get().toString()).toBe(uuid.get());
    });
  });
});
