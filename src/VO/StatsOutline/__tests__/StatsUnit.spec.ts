import { StatsUnit } from '../StatsUnit';

describe('StatsUnit', () => {
  describe('empty', () => {
    it('must be an empty unit', () => {
      expect.assertions(1);

      expect(StatsUnit.empty().get()).toBe('');
    });

    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(StatsUnit.empty()).toBe(StatsUnit.empty());
    });
  });

  describe('of', () => {
    it('if the unit is empty, returns StatsUnit.empty()', () => {
      expect.assertions(1);

      expect(StatsUnit.of('')).toBe(StatsUnit.empty());
    });

    it('normal case', () => {
      expect.assertions(3);

      const unit1: string = 'stats item unit 1';
      const unit2: string = 'stats item unit 2';
      const unit3: string = 'stats item unit 3';

      expect(StatsUnit.of(unit1).get()).toBe(unit1);
      expect(StatsUnit.of(unit2).get()).toBe(unit2);
      expect(StatsUnit.of(unit3).get()).toBe(unit3);
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      expect.assertions(16);

      const unit: StatsUnit = StatsUnit.empty();

      expect(unit.equals(null)).toBe(false);
      expect(unit.equals(undefined)).toBe(false);
      expect(unit.equals('')).toBe(false);
      expect(unit.equals('123')).toBe(false);
      expect(unit.equals('abcd')).toBe(false);
      expect(unit.equals(123)).toBe(false);
      expect(unit.equals(0)).toBe(false);
      expect(unit.equals(-12)).toBe(false);
      expect(unit.equals(0.3)).toBe(false);
      expect(unit.equals(false)).toBe(false);
      expect(unit.equals(true)).toBe(false);
      expect(unit.equals(Symbol('p'))).toBe(false);
      expect(unit.equals(20n)).toBe(false);
      expect(unit.equals({})).toBe(false);
      expect(unit.equals([])).toBe(false);
      expect(unit.equals(Object.create(null))).toBe(false);
    });

    it('returns true if both properties are the same', () => {
      expect.assertions(3);

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
      expect.assertions(3);

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
      expect.assertions(1);

      const unit: string = 'stats unit';
      const statsUnit: StatsUnit = StatsUnit.of(unit);

      expect(statsUnit.toString()).toBe(unit);
    });
  });
});
