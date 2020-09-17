import { StatsName } from '../StatsName';

describe('StatsName', () => {
  describe('empty', () => {
    it('must be an empty name', () => {
      expect.assertions(1);

      expect(StatsName.empty().get()).toBe('');
    });

    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(StatsName.empty()).toBe(StatsName.empty());
    });
  });

  describe('of', () => {
    it('if the name is empty, returns StatsName.empty()', () => {
      expect.assertions(1);

      expect(StatsName.of('')).toBe(StatsName.empty());
    });

    it('normal case', () => {
      expect.assertions(3);

      const name1: string = 'stats name 1';
      const name2: string = 'stats name 2';
      const name3: string = 'stats name 3';

      expect(StatsName.of(name1).get()).toBe(name1);
      expect(StatsName.of(name2).get()).toBe(name2);
      expect(StatsName.of(name3).get()).toBe(name3);
    });
  });

  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      expect.assertions(3);

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
      expect.assertions(3);

      const name1: StatsName = StatsName.empty();
      const name2: StatsName = StatsName.of('');
      const name3: StatsName = StatsName.of('p');

      expect(name1.isEmpty()).toBe(true);
      expect(name2.isEmpty()).toBe(true);
      expect(name3.isEmpty()).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      expect.assertions(1);

      const name: string = 'stats name';
      const statsName: StatsName = StatsName.of(name);

      expect(statsName.toString()).toBe(name);
    });
  });
});
