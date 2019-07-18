import 'jest';
import { StatsName } from '../StatsName';

describe('StatsName', () => {
  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const name1: StatsName = StatsName.of('stats name 1');
      const name2: StatsName = StatsName.of('stats name 2');
      const name3: StatsName = StatsName.of('stats name 1');

      expect(name1.equals(name1)).toEqual(true);
      expect(name1.equals(name2)).toEqual(false);
      expect(name1.equals(name3)).toEqual(true);
    });
  });
});
