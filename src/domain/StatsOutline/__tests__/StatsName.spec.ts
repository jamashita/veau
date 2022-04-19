import { StatsName } from '../StatsName';

describe('StatsName', () => {
  describe('empty', () => {
    it('must be an empty name', () => {
      expect(StatsName.empty().get()).toBe('');
    });

    it('returns singleton instance', () => {
      expect(StatsName.empty()).toBe(StatsName.empty());
    });
  });

  describe('of', () => {
    it('if the name is empty, returns StatsName.empty()', () => {
      expect(StatsName.of('')).toBe(StatsName.empty());
    });

    it('normal case', () => {
      const name1: string = 'stats name 1';
      const name2: string = 'stats name 2';
      const name3: string = 'stats name 3';

      expect(StatsName.of(name1).get()).toBe(name1);
      expect(StatsName.of(name2).get()).toBe(name2);
      expect(StatsName.of(name3).get()).toBe(name3);
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      const name: StatsName = StatsName.empty();

      expect(name.equals(null)).toBe(false);
      expect(name.equals(undefined)).toBe(false);
      expect(name.equals('')).toBe(false);
      expect(name.equals('123')).toBe(false);
      expect(name.equals('abcd')).toBe(false);
      expect(name.equals(123)).toBe(false);
      expect(name.equals(0)).toBe(false);
      expect(name.equals(-12)).toBe(false);
      expect(name.equals(0.3)).toBe(false);
      expect(name.equals(false)).toBe(false);
      expect(name.equals(true)).toBe(false);
      expect(name.equals(Symbol('p'))).toBe(false);
      expect(name.equals(20n)).toBe(false);
      expect(name.equals({})).toBe(false);
      expect(name.equals([])).toBe(false);
      expect(name.equals(Object.create(null))).toBe(false);
    });

    it('returns true if both properties are the same', () => {
      const name1: StatsName = StatsName.of('stats name 1');
      const name2: StatsName = StatsName.of('stats name 2');
      const name3: StatsName = StatsName.of('stats name 1');

      expect(name1.equals(name1)).toBe(true);
      expect(name1.equals(name2)).toBe(false);
      expect(name1.equals(name3)).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the name is empty string', () => {
      const name1: StatsName = StatsName.empty();
      const name2: StatsName = StatsName.of('');
      const name3: StatsName = StatsName.of('p');

      expect(name1.isEmpty()).toBe(true);
      expect(name2.isEmpty()).toBe(true);
      expect(name3.isEmpty()).toBe(false);
    });
  });
});
