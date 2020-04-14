import { StatsName } from '../StatsName';

// DONE
describe('StatsName', () => {
  describe('empty', () => {
    it('must be an empty name', () => {
      expect(StatsName.empty().get()).toEqual('');
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

      expect(StatsName.of(name1).get()).toEqual(name1);
      expect(StatsName.of(name2).get()).toEqual(name2);
      expect(StatsName.of(name3).get()).toEqual(name3);
    });
  });

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

  describe('isEmpty', () => {
    it('returns true if the name is empty string', () => {
      const name1: StatsName = StatsName.empty();
      const name2: StatsName = StatsName.of('');
      const name3: StatsName = StatsName.of('p');

      expect(name1.isEmpty()).toEqual(true);
      expect(name2.isEmpty()).toEqual(true);
      expect(name3.isEmpty()).toEqual(false);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const name: string = 'stats name';
      const statsName: StatsName = StatsName.of(name);

      expect(statsName.toString()).toEqual(name);
    });
  });
});
