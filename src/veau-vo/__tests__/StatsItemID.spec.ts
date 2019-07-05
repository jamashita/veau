import 'jest';
import { StatsItemID } from '../StatsItemID';

describe('StatsItemID', () => {
  describe('equals', () => {
    it('returns true if the property is the same', () => {
      const uuid1: string = 'b5203963-d996-40a7-9adb-f05ea9524af0';
      const uuid2: string = 'db9c9de2-1fc6-4072-8348-b8894239b2b0';
      const statsItemID1: StatsItemID = StatsItemID.of(uuid1);
      const statsItemID2: StatsItemID = StatsItemID.of(uuid2);
      const statsItemID3: StatsItemID = StatsItemID.of(uuid1);

      expect(statsItemID1.equals(statsItemID1)).toEqual(true);
      expect(statsItemID1.equals(statsItemID2)).toEqual(false);
      expect(statsItemID1.equals(statsItemID3)).toEqual(true);
    });
  });
});
