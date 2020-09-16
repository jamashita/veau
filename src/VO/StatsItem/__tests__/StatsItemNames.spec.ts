import { ImmutableSequence, MockSequence } from '@jamashita/publikum-collection';
import sinon, { SinonSpy } from 'sinon';
import { MockStatsItemName } from '../Mock/MockStatsItemName';
import { MockStatsItemNames } from '../Mock/MockStatsItemNames';
import { StatsItemName } from '../StatsItemName';
import { StatsItemNames } from '../StatsItemNames';

describe('StatsItemNames', () => {
  describe('of', () => {
    it('when the ImmutableSequence is zero size, returns StatsItemNames.empty()', () => {
      expect.assertions(1);

      const statsItemNames: StatsItemNames = StatsItemNames.of(ImmutableSequence.empty<StatsItemName>());

      expect(statsItemNames).toBe(StatsItemNames.empty());
    });

    it('normal case', () => {
      expect.assertions(3);

      const statsItemName1: MockStatsItemName = new MockStatsItemName();
      const statsItemName2: MockStatsItemName = new MockStatsItemName();
      const sequence: ImmutableSequence<MockStatsItemName> = ImmutableSequence.of<StatsItemName>([
        statsItemName1,
        statsItemName2
      ]);

      const statsItemNames: StatsItemNames = StatsItemNames.of(sequence);

      expect(statsItemNames.size()).toBe(sequence.size());
      for (let i: number = 0; i < statsItemNames.size(); i++) {
        expect(statsItemNames.get(i)).toBe(sequence.get(i));
      }
    });
  });

  describe('ofArray', () => {
    it('when empty Array given, returns StatsItemNames.empty()', () => {
      expect.assertions(1);

      const statsItemNames: StatsItemNames = StatsItemNames.ofArray([]);

      expect(statsItemNames).toBe(StatsItemNames.empty());
    });

    it('normal case', () => {
      expect.assertions(3);

      const name1: MockStatsItemName = new MockStatsItemName();
      const name2: MockStatsItemName = new MockStatsItemName();
      const names: Array<StatsItemName> = [name1, name2];

      const statsItemNames: StatsItemNames = StatsItemNames.ofArray(names);

      expect(statsItemNames.size()).toBe(names.length);
      for (let i: number = 0; i < statsItemNames.size(); i++) {
        expect(statsItemNames.get(i)).toBe(names[i]);
      }
    });
  });

  describe('ofSpread', () => {
    it('when no arguments given, returns StatsItemNames.empty()', () => {
      expect.assertions(1);

      const statsItemNames: StatsItemNames = StatsItemNames.ofSpread();

      expect(statsItemNames).toBe(StatsItemNames.empty());
    });

    it('normal case', () => {
      expect.assertions(3);

      const name1: MockStatsItemName = new MockStatsItemName();
      const name2: MockStatsItemName = new MockStatsItemName();

      const statsItemNames: StatsItemNames = StatsItemNames.ofSpread(name1, name2);

      expect(statsItemNames.size()).toBe(2);
      expect(statsItemNames.get(0)).toBe(name1);
      expect(statsItemNames.get(1)).toBe(name2);
    });
  });

  describe('empty', () => {
    it('generates 0-length StatsItemNames', () => {
      expect.assertions(1);

      expect(StatsItemNames.empty().size()).toBe(0);
    });

    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(StatsItemNames.empty()).toBe(StatsItemNames.empty());
    });
  });

  describe('get', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const name1: MockStatsItemName = new MockStatsItemName();
      const name2: MockStatsItemName = new MockStatsItemName();
      const name3: MockStatsItemName = new MockStatsItemName();

      const sequence: MockSequence<MockStatsItemName> = new MockSequence<MockStatsItemName>([name1, name2, name3]);

      const spy: SinonSpy = sinon.spy();

      sequence.get = spy;

      const names: StatsItemNames = StatsItemNames.of(sequence);

      names.get(0);

      expect(spy.called).toBe(true);
    });
  });

  describe('contains', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const name1: MockStatsItemName = new MockStatsItemName();
      const name2: MockStatsItemName = new MockStatsItemName();
      const name3: MockStatsItemName = new MockStatsItemName();

      const sequence: MockSequence<MockStatsItemName> = new MockSequence<MockStatsItemName>([name1, name2, name3]);

      const spy: SinonSpy = sinon.spy();

      sequence.contains = spy;

      const names: StatsItemNames = StatsItemNames.of(sequence);

      names.contains(name2);

      expect(spy.called).toBe(true);
    });
  });

  describe('size', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const name1: MockStatsItemName = new MockStatsItemName();
      const name2: MockStatsItemName = new MockStatsItemName();
      const name3: MockStatsItemName = new MockStatsItemName();

      const sequence: MockSequence<MockStatsItemName> = new MockSequence<MockStatsItemName>([name1, name2, name3]);

      const spy: SinonSpy = sinon.spy();

      sequence.size = spy;

      const names: StatsItemNames = StatsItemNames.of(sequence);

      names.size();

      expect(spy.called).toBe(true);
    });
  });

  describe('forEach', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const name1: MockStatsItemName = new MockStatsItemName();
      const name2: MockStatsItemName = new MockStatsItemName();
      const name3: MockStatsItemName = new MockStatsItemName();

      const sequence: MockSequence<MockStatsItemName> = new MockSequence<MockStatsItemName>([name1, name2, name3]);

      const spy: SinonSpy = sinon.spy();

      sequence.forEach = spy;

      const names: StatsItemNames = StatsItemNames.of(sequence);

      names.forEach(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const name1: MockStatsItemName = new MockStatsItemName();
      const name2: MockStatsItemName = new MockStatsItemName();
      const name3: MockStatsItemName = new MockStatsItemName();

      const sequence: MockSequence<MockStatsItemName> = new MockSequence<MockStatsItemName>([name1, name2, name3]);

      const spy: SinonSpy = sinon.spy();

      sequence.isEmpty = spy;

      const names: StatsItemNames = StatsItemNames.of(sequence);

      names.isEmpty();

      expect(spy.called).toBe(true);
    });
  });

  describe('map', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const name1: MockStatsItemName = new MockStatsItemName();
      const name2: MockStatsItemName = new MockStatsItemName();
      const name3: MockStatsItemName = new MockStatsItemName();

      const sequence: MockSequence<MockStatsItemName> = new MockSequence<MockStatsItemName>([name1, name2, name3]);

      const names: StatsItemNames = StatsItemNames.of(sequence);

      const arr: Array<string> = names.map<string>((name: StatsItemName) => {
        return name.get();
      });

      expect(arr).toHaveLength(3);
    });
  });

  describe('equals', () => {
    it('same instance', () => {
      expect.assertions(1);

      const name1: MockStatsItemName = new MockStatsItemName('item 1');
      const name2: MockStatsItemName = new MockStatsItemName('item 2');

      const names: StatsItemNames = StatsItemNames.ofArray([name1, name2]);

      expect(names.equals(names)).toBe(true);
    });

    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const name1: MockStatsItemName = new MockStatsItemName();
      const name2: MockStatsItemName = new MockStatsItemName();
      const name3: MockStatsItemName = new MockStatsItemName();

      const sequence: MockSequence<MockStatsItemName> = new MockSequence<MockStatsItemName>([name1, name2, name3]);

      const spy: SinonSpy = sinon.spy();

      sequence.equals = spy;

      const names: StatsItemNames = StatsItemNames.of(sequence);

      names.equals(new MockStatsItemNames());

      expect(spy.called).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      expect.assertions(1);

      const names: StatsItemNames = StatsItemNames.ofArray([StatsItemName.of('item 1'), StatsItemName.of('item 2')]);

      expect(names.toJSON()).toStrictEqual(['item 1', 'item 2']);
    });
  });

  describe('toString', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const name1: MockStatsItemName = new MockStatsItemName();
      const name2: MockStatsItemName = new MockStatsItemName();
      const name3: MockStatsItemName = new MockStatsItemName();

      const sequence: MockSequence<MockStatsItemName> = new MockSequence<MockStatsItemName>([name1, name2, name3]);

      const spy: SinonSpy = sinon.spy();

      sequence.toString = spy;

      const names: StatsItemNames = StatsItemNames.of(sequence);

      names.toString();

      expect(spy.called).toBe(true);
    });
  });

  describe('iterator', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(3);

      const name1: MockStatsItemName = new MockStatsItemName();
      const name2: MockStatsItemName = new MockStatsItemName();
      const name3: MockStatsItemName = new MockStatsItemName();

      const arr: Array<MockStatsItemName> = [name1, name2, name3];

      const sequence: MockSequence<MockStatsItemName> = new MockSequence<MockStatsItemName>(arr);

      const names: StatsItemNames = StatsItemNames.of(sequence);
      let i: number = 0;

      for (const pair of names) {
        expect(pair.getValue()).toBe(arr[i]);
        i++;
      }
    });
  });

  describe('every', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const name1: MockStatsItemName = new MockStatsItemName();
      const name2: MockStatsItemName = new MockStatsItemName();
      const name3: MockStatsItemName = new MockStatsItemName();

      const sequence: MockSequence<MockStatsItemName> = new MockSequence<MockStatsItemName>([name1, name2, name3]);

      const spy: SinonSpy = sinon.spy();

      sequence.every = spy;

      const names: StatsItemNames = StatsItemNames.of(sequence);

      names.every(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('some', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const name1: MockStatsItemName = new MockStatsItemName();
      const name2: MockStatsItemName = new MockStatsItemName();
      const name3: MockStatsItemName = new MockStatsItemName();

      const sequence: MockSequence<MockStatsItemName> = new MockSequence<MockStatsItemName>([name1, name2, name3]);

      const spy: SinonSpy = sinon.spy();

      sequence.some = spy;

      const names: StatsItemNames = StatsItemNames.of(sequence);

      names.some(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });
});
