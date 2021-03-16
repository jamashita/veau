import { StatsItemName } from '../StatsItemName';

describe('StatsItemName', () => {
  describe('empty', () => {
    it('must be an empty name', () => {
      expect.assertions(1);

      expect(StatsItemName.empty().get()).toBe('');
    });

    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(StatsItemName.empty()).toBe(StatsItemName.empty());
    });
  });

  describe('of', () => {
    it('if the name is empty, returns StatsItemName.empty()', () => {
      expect.assertions(1);

      expect(StatsItemName.of('')).toBe(StatsItemName.empty());
    });

    it('normal case', () => {
      expect.assertions(3);

      const name1: string = 'stats item name 1';
      const name2: string = 'stats item name 2';
      const name3: string = 'stats item name 3';

      expect(StatsItemName.of(name1).get()).toBe(name1);
      expect(StatsItemName.of(name2).get()).toBe(name2);
      expect(StatsItemName.of(name3).get()).toBe(name3);
    });
  });

  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      expect.assertions(3);

      const name1: StatsItemName = StatsItemName.of('stats item name 1');
      const name2: StatsItemName = StatsItemName.of('stats item name 2');
      const name3: StatsItemName = StatsItemName.of('stats item name 1');

      expect(name1.equals(name1)).toBe(true);
      expect(name1.equals(name2)).toBe(false);
      expect(name1.equals(name3)).toBe(true);
    });
  });

  describe('length', () => {
    it('returns containing string length', () => {
      expect.assertions(3);

      const name1: StatsItemName = StatsItemName.empty();
      const name2: StatsItemName = StatsItemName.of('');
      const name3: StatsItemName = StatsItemName.of('p309');

      expect(name1.length()).toBe(0);
      expect(name2.length()).toBe(0);
      expect(name3.length()).toBe(4);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the name is empty string', () => {
      expect.assertions(3);

      const name1: StatsItemName = StatsItemName.empty();
      const name2: StatsItemName = StatsItemName.of('');
      const name3: StatsItemName = StatsItemName.of('p');

      expect(name1.isEmpty()).toBe(true);
      expect(name2.isEmpty()).toBe(true);
      expect(name3.isEmpty()).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      expect.assertions(1);

      const name: string = 'stats item name 1';
      const statsItemName: StatsItemName = StatsItemName.of(name);

      expect(statsItemName.toString()).toBe(name);
    });
  });
});
