import { RegionName } from '../RegionName';

describe('RegionName', () => {
  describe('empty', () => {
    it('always returns empty string', () => {
      expect.assertions(1);

      expect(RegionName.empty().get()).toBe('');
    });

    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(RegionName.empty()).toBe(RegionName.empty());
    });
  });

  describe('of', () => {
    it('returns RegionName.empty() when empty string is given', () => {
      expect.assertions(1);

      expect(RegionName.of('')).toBe(RegionName.empty());
    });

    it('normal case', () => {
      expect.assertions(2);

      const name1: string = 'region name 1';
      const name2: string = 'region name 2';

      expect(RegionName.of(name1).get()).toBe(name1);
      expect(RegionName.of(name2).get()).toBe(name2);
    });
  });

  describe('isEmpty', () => {
    it('returns true if RegionName.empty() is given', () => {
      expect.assertions(1);

      expect(RegionName.empty().isEmpty()).toBe(true);
    });

    it('normal case', () => {
      expect.assertions(2);

      const name1: string = 'region name 1';
      const name2: string = 'region name 2';

      expect(RegionName.of(name1).isEmpty()).toBe(false);
      expect(RegionName.of(name2).isEmpty()).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      expect.assertions(16);

      const name: RegionName = RegionName.of('region name');

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
      expect.assertions(3);

      const name1: RegionName = RegionName.of('region name 1');
      const name2: RegionName = RegionName.of('region name 2');
      const name3: RegionName = RegionName.of('region name 1');

      expect(name1.equals(name1)).toBe(true);
      expect(name1.equals(name2)).toBe(false);
      expect(name1.equals(name3)).toBe(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      expect.assertions(1);

      const name: string = 'region name';
      const regionName: RegionName = RegionName.of(name);

      expect(regionName.toString()).toBe(name);
    });
  });
});
