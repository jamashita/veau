import { ImmutableSequence, MockSequence } from '@jamashita/lluvia-collection';
import sinon, { SinonSpy } from 'sinon';
import { MockStatsItemName } from '../mock/MockStatsItemName';
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
      const sequence: ImmutableSequence<MockStatsItemName> = ImmutableSequence.ofArray<StatsItemName>([
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
      const names: StatsItemNames = StatsItemNames.of(sequence);

      // @ts-expect-error
      names.names.get = spy;
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
      const names: StatsItemNames = StatsItemNames.of(sequence);

      // @ts-expect-error
      names.names.contains = spy;
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
      const names: StatsItemNames = StatsItemNames.of(sequence);

      // @ts-expect-error
      names.names.size = spy;
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
      const names: StatsItemNames = StatsItemNames.of(sequence);

      // @ts-expect-error
      names.names.forEach = spy;
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
      const names: StatsItemNames = StatsItemNames.of(sequence);

      // @ts-expect-error
      names.names.isEmpty = spy;
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

      const mapped: ImmutableSequence<string> = names.map<string>((name: StatsItemName) => {
        return name.get();
      });

      expect(mapped.size()).toBe(3);
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      expect.assertions(16);

      const names: StatsItemNames = StatsItemNames.empty();

      expect(names.equals(null)).toBe(false);
      expect(names.equals(undefined)).toBe(false);
      expect(names.equals('')).toBe(false);
      expect(names.equals('123')).toBe(false);
      expect(names.equals('abcd')).toBe(false);
      expect(names.equals(123)).toBe(false);
      expect(names.equals(0)).toBe(false);
      expect(names.equals(-12)).toBe(false);
      expect(names.equals(0.3)).toBe(false);
      expect(names.equals(false)).toBe(false);
      expect(names.equals(true)).toBe(false);
      expect(names.equals(Symbol('p'))).toBe(false);
      expect(names.equals(20n)).toBe(false);
      expect(names.equals({})).toBe(false);
      expect(names.equals([])).toBe(false);
      expect(names.equals(Object.create(null))).toBe(false);
    });

    it('returns true if the same instance given', () => {
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
      const names: StatsItemNames = StatsItemNames.of(sequence);

      // @ts-expect-error
      names.names.equals = spy;
      names.equals(StatsItemNames.empty());

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
      const names: StatsItemNames = StatsItemNames.of(sequence);

      // @ts-expect-error
      names.names.toString = spy;
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

      for (const [, v] of names) {
        expect(v).toBe(arr[i]);
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
      const names: StatsItemNames = StatsItemNames.of(sequence);

      // @ts-expect-error
      names.names.every = spy;
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
      const names: StatsItemNames = StatsItemNames.of(sequence);

      // @ts-expect-error
      names.names.some = spy;
      names.some(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('values', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const name1: MockStatsItemName = new MockStatsItemName();
      const name2: MockStatsItemName = new MockStatsItemName();
      const name3: MockStatsItemName = new MockStatsItemName();

      const sequence: MockSequence<MockStatsItemName> = new MockSequence<MockStatsItemName>([name1, name2, name3]);

      const spy: SinonSpy = sinon.spy();
      const names: StatsItemNames = StatsItemNames.of(sequence);

      // @ts-expect-error
      names.names.values = spy;
      names.values();

      expect(spy.called).toBe(true);
    });
  });

  describe('filter', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const name1: MockStatsItemName = new MockStatsItemName();
      const name2: MockStatsItemName = new MockStatsItemName();
      const name3: MockStatsItemName = new MockStatsItemName();

      const sequence: MockSequence<MockStatsItemName> = new MockSequence<MockStatsItemName>([name1, name2, name3]);

      const spy: SinonSpy = sinon.spy();
      const names: StatsItemNames = StatsItemNames.of(sequence);

      // @ts-expect-error
      names.names.filter = spy;
      names.filter(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('find', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const name1: MockStatsItemName = new MockStatsItemName();
      const name2: MockStatsItemName = new MockStatsItemName();
      const name3: MockStatsItemName = new MockStatsItemName();

      const sequence: MockSequence<MockStatsItemName> = new MockSequence<MockStatsItemName>([name1, name2, name3]);

      const spy: SinonSpy = sinon.spy();
      const names: StatsItemNames = StatsItemNames.of(sequence);

      // @ts-expect-error
      names.names.find = spy;
      names.find(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });
});
