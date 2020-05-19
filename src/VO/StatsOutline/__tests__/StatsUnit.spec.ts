import { StatsUnit } from '../StatsUnit';

describe('StatsUnit', () => {
  describe('empty', () => {
    it('must be an empty unit', () => {
      expect(StatsUnit.empty().get()).toBe('');
    });

    it('returns singleton instance', () => {
      expect(StatsUnit.empty()).toBe(StatsUnit.empty());
    });
  });

  describe('of', () => {
    it('if the unit is empty, returns StatsUnit.empty()', () => {
      expect(StatsUnit.of('')).toBe(StatsUnit.empty());
    });

    it('normal case', () => {
      const unit1: string = 'stats item unit 1';
      const unit2: string = 'stats item unit 2';
      const unit3: string = 'stats item unit 3';

      expect(StatsUnit.of(unit1).get()).toBe(unit1);
      expect(StatsUnit.of(unit2).get()).toBe(unit2);
      expect(StatsUnit.of(unit3).get()).toBe(unit3);
    });
  });

  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const unit1: StatsUnit = StatsUnit.of('stats unit 1');
      const unit2: StatsUnit = StatsUnit.of('stats unit 2');
      const unit3: StatsUnit = StatsUnit.of('stats unit 1');

      expect(unit1.equals(unit1)).toBe(true);
      expect(unit1.equals(unit2)).toBe(false);
      expect(unit1.equals(unit3)).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the unit is empty string', () => {
      const unit1: StatsUnit = StatsUnit.empty();
      const unit2: StatsUnit = StatsUnit.of('');
      const unit3: StatsUnit = StatsUnit.of('p');

      expect(unit1.isEmpty()).toBe(true);
      expect(unit2.isEmpty()).toBe(true);
      expect(unit3.isEmpty()).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const unit: string = 'stats unit';
      const statsUnit: StatsUnit = StatsUnit.of(unit);

      expect(statsUnit.toString()).toBe(unit);
    });
  });
});
