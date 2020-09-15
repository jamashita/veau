import { UUID } from '@jamashita/publikum-uuid';
import { RegionError } from '../Error/RegionError';
import { RegionID } from '../RegionID';

describe('RegionID', () => {
  describe('empty', () => {
    it('always returns 36 length string', () => {
      expect.assertions(1);

      expect(RegionID.empty().get().get()).toHaveLength(36);
    });

    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(RegionID.empty()).toBe(RegionID.empty());
    });
  });

  describe('of', () => {
    it('normal case', () => {
      expect.assertions(2);

      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();

      expect(RegionID.of(uuid1).get()).toBe(uuid1);
      expect(RegionID.of(uuid2).get()).toBe(uuid2);
    });
  });

  describe('ofString', () => {
    it('normal case', () => {
      expect.assertions(1);

      const uuid: UUID = UUID.v4();

      const regionID: RegionID = RegionID.ofString(uuid.get());

      expect(regionID.get().get()).toHaveLength(36);
    });

    it('returns Dead when uuid length string is not given', () => {
      expect.assertions(1);

      expect(() => {
        RegionID.ofString('quasi');
      }).toThrow(RegionError);
    });
  });

  describe('equals', () => {
    it('returns true if the property is the same', () => {
      expect.assertions(3);

      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const regionID1: RegionID = RegionID.of(uuid1);
      const regionID2: RegionID = RegionID.of(uuid2);
      const regionID3: RegionID = RegionID.of(uuid1);

      expect(regionID1.equals(regionID1)).toBe(true);
      expect(regionID1.equals(regionID2)).toBe(false);
      expect(regionID1.equals(regionID3)).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('when RegionID.empty() given , returns true', () => {
      expect.assertions(1);

      expect(RegionID.empty().isEmpty()).toBe(true);
    });

    it('normal case', () => {
      expect.assertions(2);

      expect(RegionID.of(UUID.v4()).isEmpty()).toBe(false);
      expect(RegionID.of(UUID.v4()).isEmpty()).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      expect.assertions(1);

      const uuid: UUID = UUID.v4();
      const regionID: RegionID = RegionID.of(uuid);

      expect(regionID.toString()).toBe(uuid.toString());
    });
  });
});
