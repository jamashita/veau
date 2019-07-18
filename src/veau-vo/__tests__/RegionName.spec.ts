import 'jest';
import { RegionName } from '../RegionName';

describe('RegionName', () => {
  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const name1: RegionName = RegionName.of('region name 1');
      const name2: RegionName = RegionName.of('region name 2');
      const name3: RegionName = RegionName.of('region name 1');

      expect(name1.equals(name1)).toEqual(true);
      expect(name1.equals(name2)).toEqual(false);
      expect(name1.equals(name3)).toEqual(true);
    });
  });
});
