import 'jest';
import { RegionID } from '../RegionID';

describe('RegionID', () => {
  describe('equals', () => {
    it('returns true if the property is the same', () => {
      const regionID1: RegionID = RegionID.of(1);
      const regionID2: RegionID = RegionID.of(2);
      const regionID3: RegionID = RegionID.of(1);

      expect(regionID1.equals(regionID1)).toEqual(true);
      expect(regionID1.equals(regionID2)).toEqual(false);
      expect(regionID1.equals(regionID3)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const id: number = 1;
      const regionID: RegionID = RegionID.of(id);

      expect(regionID.toString()).toEqual(id.toString());
    });
  });
});
