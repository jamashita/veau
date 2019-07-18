import 'jest';
import { StatsItemName } from '../StatsItemName';

describe('StatsItemName', () => {
  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const name1: StatsItemName = StatsItemName.of('stats item name 1');
      const name2: StatsItemName = StatsItemName.of('stats item name 2');
      const name3: StatsItemName = StatsItemName.of('stats item name 1');

      expect(name1.equals(name1)).toEqual(true);
      expect(name1.equals(name2)).toEqual(false);
      expect(name1.equals(name3)).toEqual(true);
    });
  });
});
