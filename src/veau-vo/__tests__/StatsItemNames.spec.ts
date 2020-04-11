import { None } from '../../veau-general/Optional/None';
import { StatsItemName } from '../StatsItemName';
import { StatsItemNames } from '../StatsItemNames';

describe('StatsItemNames', () => {
  describe('[Symbol.iterator]', () => {
    it('can iterate for loop', () => {
      const name1: StatsItemName = StatsItemName.of('item 1');
      const name2: StatsItemName = StatsItemName.of('item 2');
      const name3: StatsItemName = StatsItemName.of('item 3');

      const names: StatsItemNames = StatsItemNames.of([
        name1,
        name2,
        name3
      ]);

      let i: number = 0;
      for (const name of names) {
        expect(names.get(i).get()).toBe(name);
        i++;
      }

      expect(i).toEqual(names.size());
    });
  });

  describe('get', () => {
    it('returns StatsItemName of index-th item', () => {
      const name1: StatsItemName = StatsItemName.of('item 1');
      const name2: StatsItemName = StatsItemName.of('item 2');
      const name3: StatsItemName = StatsItemName.of('item 3');

      const names: StatsItemNames = StatsItemNames.of([
        name1,
        name2,
        name3
      ]);

      expect(names.size()).toEqual(3);
      expect(names.get(0).get()).toEqual(name1);
      expect(names.get(1).get()).toEqual(name2);
      expect(names.get(2).get()).toEqual(name3);
    });

    it('returns None if the index is out of range', () => {
      const name1: StatsItemName = StatsItemName.of('item 1');
      const name2: StatsItemName = StatsItemName.of('item 2');
      const name3: StatsItemName = StatsItemName.of('item 3');

      const names: StatsItemNames = StatsItemNames.of([
        name1,
        name2,
        name3
      ]);

      expect(names.get(-1)).toBeInstanceOf(None);
      expect(names.get(3)).toBeInstanceOf(None);
    });
  });

  describe('contains', () => {
    it('returns true if the element exists in the StatsItemNames', () => {
      const name1: StatsItemName = StatsItemName.of('item 1');
      const name2: StatsItemName = StatsItemName.of('item 2');
      const name3: StatsItemName = StatsItemName.of('item 3');
      const name4: StatsItemName = StatsItemName.of('item 1');

      const names: StatsItemNames = StatsItemNames.of([
        name1,
        name2
      ]);

      expect(names.contains(name1)).toEqual(true);
      expect(names.contains(name2)).toEqual(true);
      expect(names.contains(name3)).toEqual(false);
      expect(names.contains(name4)).toEqual(true);
    });
  });

  describe('isEmpty', () => {
    it('returns true if hte elements are 0', () => {
      const name1: StatsItemName = StatsItemName.of('item 1');
      const name2: StatsItemName = StatsItemName.of('item 2');

      const names1: StatsItemNames = StatsItemNames.of([
      ]);
      const names2: StatsItemNames = StatsItemNames.of([
        name1,
        name2
      ]);

      expect(names1.isEmpty()).toEqual(true);
      expect(names2.isEmpty()).toEqual(false);
    });
  });

  describe('equals', () => {
    it('returns false if the lengths are different', () => {
      const name1: StatsItemName = StatsItemName.of('item 1');
      const name2: StatsItemName = StatsItemName.of('item 2');
      const name3: StatsItemName = StatsItemName.of('item 3');

      const names1: StatsItemNames = StatsItemNames.of([
        name1,
        name2,
        name3
      ]);
      const names2: StatsItemNames = StatsItemNames.of([
        name1
      ]);

      expect(names1.equals(names1)).toEqual(true);
      expect(names1.equals(names2)).toEqual(false);
    });

    it('returns false if the sequences are different', () => {
      const name1: StatsItemName = StatsItemName.of('item 1');
      const name2: StatsItemName = StatsItemName.of('item 2');

      const names1: StatsItemNames = StatsItemNames.of([
        name1,
        name2
      ]);
      const names2: StatsItemNames = StatsItemNames.of([
        name2,
        name1
      ]);

      expect(names1.equals(names1)).toEqual(true);
      expect(names1.equals(names2)).toEqual(false);
    });

    it('returns true if the size and the sequence are the same', () => {
      const name1: StatsItemName = StatsItemName.of('item 1');
      const name2: StatsItemName = StatsItemName.of('item 2');

      const names1: StatsItemNames = StatsItemNames.of([
        name1,
        name2
      ]);
      const names2: StatsItemNames = StatsItemNames.of([
        name1,
        name2
      ]);

      expect(names1.equals(names1)).toEqual(true);
      expect(names1.equals(names2)).toEqual(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const name1: StatsItemName = StatsItemName.of('item 1');
      const name2: StatsItemName = StatsItemName.of('item 2');

      const names: StatsItemNames = StatsItemNames.of([
        name1,
        name2
      ]);

      expect(names.toJSON()).toEqual([
        'item 1',
        'item 2'
      ]);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const name1: string = 'item 1';
      const name2: string = 'item 2';
      const statsItemName1: StatsItemName = StatsItemName.of(name1);
      const statsItemName2: StatsItemName = StatsItemName.of(name2);

      const statsItemNames: StatsItemNames = StatsItemNames.of([
        statsItemName1,
        statsItemName2
      ]);

      expect(statsItemNames.toString()).toEqual(`${name1}, ${name2}`);
    });
  });
});
