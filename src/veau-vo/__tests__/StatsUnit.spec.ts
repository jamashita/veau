import 'jest';
import { StatsUnit } from '../StatsUnit';

describe('StatsUnit', () => {
  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const unit1: StatsUnit = StatsUnit.of('stats unit 1');
      const unit2: StatsUnit = StatsUnit.of('stats unit 2');
      const unit3: StatsUnit = StatsUnit.of('stats unit 1');

      expect(unit1.equals(unit1)).toEqual(true);
      expect(unit1.equals(unit2)).toEqual(false);
      expect(unit1.equals(unit3)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const unit: string = 'stats unit';
      const statsUnit: StatsUnit = StatsUnit.of(unit);

      expect(statsUnit.toString()).toEqual(unit);
    });
  });
});
