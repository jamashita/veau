import { StatsUnit } from '../StatsUnit';

// DONE
describe('StatsUnit', () => {
  describe('empty', () => {
    it('must be an empty name', () => {
      expect(StatsUnit.empty().get()).toEqual('');
    });

    it('returns singleton instance', () => {
      expect(StatsUnit.empty()).toBe(StatsUnit.empty());
    });
  });

  describe('of', () => {
    it('if the name is empty, returns StatsUnit.empty()', () => {
      expect(StatsUnit.of('')).toBe(StatsUnit.empty());
    });

    it('normal case', () => {
      const name1: string = 'stats item name 1';
      const name2: string = 'stats item name 2';
      const name3: string = 'stats item name 3';

      expect(StatsUnit.of(name1).get()).toEqual(name1);
      expect(StatsUnit.of(name2).get()).toEqual(name2);
      expect(StatsUnit.of(name3).get()).toEqual(name3);
    });
  });

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

  describe('isEmpty', () => {
    it('returns true if the name is empty string', () => {
      const name1: StatsUnit = StatsUnit.empty();
      const name2: StatsUnit = StatsUnit.of('');
      const name3: StatsUnit = StatsUnit.of('p');

      expect(name1.isEmpty()).toEqual(true);
      expect(name2.isEmpty()).toEqual(true);
      expect(name3.isEmpty()).toEqual(false);
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
