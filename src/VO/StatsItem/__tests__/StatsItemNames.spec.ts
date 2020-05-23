import { Absent, ImmutableSequence } from 'publikum';

import { MockStatsItemName } from '../Mock/MockStatsItemName';
import { StatsItemName } from '../StatsItemName';
import { StatsItemNames } from '../StatsItemNames';

describe('StatsItemNames', () => {
  describe('of', () => {
    it('when the ImmutableSequence is zero size, returns StatsItemNames.empty()', () => {
      const statsItemNames: StatsItemNames = StatsItemNames.of(ImmutableSequence.empty<StatsItemName>());

      expect(statsItemNames).toBe(StatsItemNames.empty());
    });

    it('normal case', () => {
      const statsItemName1: MockStatsItemName = new MockStatsItemName();
      const statsItemName2: MockStatsItemName = new MockStatsItemName();
      const sequence: ImmutableSequence<MockStatsItemName> = ImmutableSequence.of<StatsItemName>([
        statsItemName1,
        statsItemName2
      ]);

      const statsItemNames: StatsItemNames = StatsItemNames.of(sequence);

      expect(statsItemNames.size()).toBe(sequence.size());
      for (let i: number = 0; i < statsItemNames.size(); i++) {
        expect(statsItemNames.get(i).get()).toBe(sequence.get(i).get());
      }
    });
  });

  describe('ofArray', () => {
    it('when empty Array given, returns StatsItemNames.empty()', () => {
      const statsItemNames: StatsItemNames = StatsItemNames.ofArray([]);

      expect(statsItemNames).toBe(StatsItemNames.empty());
    });

    it('normal case', () => {
      const name1: MockStatsItemName = new MockStatsItemName();
      const name2: MockStatsItemName = new MockStatsItemName();
      const names: Array<StatsItemName> = [name1, name2];

      const statsItemNames: StatsItemNames = StatsItemNames.ofArray(names);

      expect(statsItemNames.size()).toBe(names.length);
      for (let i: number = 0; i < statsItemNames.size(); i++) {
        expect(statsItemNames.get(i).get()).toBe(names[i]);
      }
    });
  });

  describe('ofSpread', () => {
    it('when no arguments given, returns StatsItemNames.empty()', () => {
      const statsItemNames: StatsItemNames = StatsItemNames.ofSpread();

      expect(statsItemNames).toBe(StatsItemNames.empty());
    });

    it('normal case', () => {
      const name1: MockStatsItemName = new MockStatsItemName();
      const name2: MockStatsItemName = new MockStatsItemName();

      const statsItemNames: StatsItemNames = StatsItemNames.ofSpread(name1, name2);

      expect(statsItemNames.size()).toBe(2);
      expect(statsItemNames.get(0).get()).toBe(name1);
      expect(statsItemNames.get(1).get()).toBe(name2);
    });
  });

  describe('empty', () => {
    it('generates 0-length StatsItemNames', () => {
      expect(StatsItemNames.empty().size()).toBe(0);
    });

    it('returns singleton instance', () => {
      expect(StatsItemNames.empty()).toBe(StatsItemNames.empty());
    });
  });

  describe('get', () => {
    it('returns StatsItemName of index-th item', () => {
      const names: Array<StatsItemName> = [new MockStatsItemName(), new MockStatsItemName(), new MockStatsItemName()];

      const statsItemNames: StatsItemNames = StatsItemNames.ofArray(names);

      expect(statsItemNames.size()).toBe(names.length);
      for (let i: number = 0; i < statsItemNames.size(); i++) {
        expect(statsItemNames.get(i).get()).toBe(names[i]);
      }
    });

    it('returns Absent if the index is out of range', () => {
      const names: StatsItemNames = StatsItemNames.ofArray([
        new MockStatsItemName(),
        new MockStatsItemName(),
        new MockStatsItemName()
      ]);

      expect(names.get(-1)).toBeInstanceOf(Absent);
      expect(names.get(3)).toBeInstanceOf(Absent);
    });
  });

  describe('contains', () => {
    it('returns true if the element exists in the StatsItemNames', () => {
      const name1: MockStatsItemName = new MockStatsItemName('item 1');
      const name2: MockStatsItemName = new MockStatsItemName('item 2');
      const name3: MockStatsItemName = new MockStatsItemName('item 3');
      const name4: MockStatsItemName = new MockStatsItemName('item 1');

      const names: StatsItemNames = StatsItemNames.ofArray([name1, name2]);

      expect(names.contains(name1)).toBe(true);
      expect(names.contains(name2)).toBe(true);
      expect(names.contains(name3)).toBe(false);
      expect(names.contains(name4)).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('returns true if hte elements are 0', () => {
      const names1: StatsItemNames = StatsItemNames.ofArray([]);
      const names2: StatsItemNames = StatsItemNames.ofArray([new MockStatsItemName(), new MockStatsItemName()]);

      expect(names1.isEmpty()).toBe(true);
      expect(names2.isEmpty()).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns false if the lengths are different', () => {
      const name1: MockStatsItemName = new MockStatsItemName('item 1');
      const name2: MockStatsItemName = new MockStatsItemName('item 2');
      const name3: MockStatsItemName = new MockStatsItemName('item 3');

      const names1: StatsItemNames = StatsItemNames.ofArray([name1, name2, name3]);
      const names2: StatsItemNames = StatsItemNames.ofArray([name1]);

      expect(names1.equals(names1)).toBe(true);
      expect(names1.equals(names2)).toBe(false);
    });

    it('returns false if the sequences are different', () => {
      const name1: MockStatsItemName = new MockStatsItemName('item 1');
      const name2: MockStatsItemName = new MockStatsItemName('item 2');

      const names1: StatsItemNames = StatsItemNames.ofArray([name1, name2]);
      const names2: StatsItemNames = StatsItemNames.ofArray([name2, name1]);

      expect(names1.equals(names1)).toBe(true);
      expect(names1.equals(names2)).toBe(false);
    });

    it('returns true if the size and the sequence are the same', () => {
      const name1: MockStatsItemName = new MockStatsItemName('item 1');
      const name2: MockStatsItemName = new MockStatsItemName('item 2');

      const names1: StatsItemNames = StatsItemNames.ofArray([name1, name2]);
      const names2: StatsItemNames = StatsItemNames.ofArray([name1, name2]);

      expect(names1.equals(names1)).toBe(true);
      expect(names1.equals(names2)).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const names: StatsItemNames = StatsItemNames.ofArray([StatsItemName.of('item 1'), StatsItemName.of('item 2')]);

      expect(names.toJSON()).toEqual(['item 1', 'item 2']);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const name1: string = 'item 1';
      const name2: string = 'item 2';

      const statsItemNames: StatsItemNames = StatsItemNames.ofArray([StatsItemName.of(name1), StatsItemName.of(name2)]);

      expect(statsItemNames.toString()).toBe(`${name1}, ${name2}`);
    });
  });
});
