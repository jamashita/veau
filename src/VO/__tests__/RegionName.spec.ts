import { RegionName } from '../RegionName';

// DONE
describe('RegionName', () => {
  describe('empty', () => {
    it('always returns empty string', () => {
      expect(RegionName.empty().get()).toEqual('');
    });

    it('returns singleton instance', () => {
      expect(RegionName.empty()).toBe(RegionName.empty());
    });
  });

  describe('of', () => {
    it('returns RegionName.empty() when empty string is given', () => {
      expect(RegionName.of('')).toEqual(RegionName.empty());
    });

    it('normal case', () => {
      const name1: string = 'region name 1';
      const name2: string = 'region name 2';

      expect(RegionName.of(name1).get()).toEqual(name1);
      expect(RegionName.of(name2).get()).toEqual(name2);
    });
  });

  describe('isEmpty', () => {
    it('returns true if RegionName.empty() is given', () => {
      expect(RegionName.empty().isEmpty()).toEqual(true);
    });

    it('normal case', () => {
      const name1: string = 'region name 1';
      const name2: string = 'region name 2';

      expect(RegionName.of(name1).isEmpty()).toEqual(false);
      expect(RegionName.of(name2).isEmpty()).toEqual(false);
    });
  });

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

  describe('toString', () => {
    it('returns the original string', () => {
      const name: string = 'region name';
      const regionName: RegionName = RegionName.of(name);

      expect(regionName.toString()).toEqual(name);
    });
  });
});
