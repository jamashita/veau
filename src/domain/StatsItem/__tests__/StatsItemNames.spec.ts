import { ImmutableSequence, MockSequence, Sequence } from '@jamashita/lluvia-sequence';
import { StatsItemName } from '../StatsItemName';
import { StatsItemNames } from '../StatsItemNames';

describe('StatsItemNames', () => {
  describe('of', () => {
    it('when the ImmutableSequence is zero size, returns StatsItemNames.empty()', () => {
      const statsItemNames: StatsItemNames = StatsItemNames.of(ImmutableSequence.empty());

      expect(statsItemNames).toBe(StatsItemNames.empty());
    });

    it('normal case', () => {
      const statsItemName1: StatsItemName = StatsItemName.of('');
      const statsItemName2: StatsItemName = StatsItemName.of('');
      const sequence: ImmutableSequence<StatsItemName> = ImmutableSequence.ofArray<StatsItemName>([
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
      const statsItemNames: StatsItemNames = StatsItemNames.ofArray([]);

      expect(statsItemNames).toBe(StatsItemNames.empty());
    });

    it('normal case', () => {
      const name1: StatsItemName = StatsItemName.of('');
      const name2: StatsItemName = StatsItemName.of('');
      const names: Array<StatsItemName> = [name1, name2];

      const statsItemNames: StatsItemNames = StatsItemNames.ofArray(names);

      expect(statsItemNames.size()).toBe(names.length);
      for (let i: number = 0; i < statsItemNames.size(); i++) {
        expect(statsItemNames.get(i)).toBe(names[i]);
      }
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
    it('delegates its inner collection instance', () => {
      const name1: StatsItemName = StatsItemName.of('');
      const name2: StatsItemName = StatsItemName.of('');
      const name3: StatsItemName = StatsItemName.of('');

      const sequence: MockSequence<StatsItemName> = new MockSequence([name1, name2, name3]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'get');
      const names: StatsItemNames = StatsItemNames.of(sequence);

      // @ts-expect-error
      names.names = sequence;
      names.get(0);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('contains', () => {
    it('delegates its inner collection instance', () => {
      const name1: StatsItemName = StatsItemName.of('');
      const name2: StatsItemName = StatsItemName.of('');
      const name3: StatsItemName = StatsItemName.of('');

      const sequence: MockSequence<StatsItemName> = new MockSequence([name1, name2, name3]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'contains');
      const names: StatsItemNames = StatsItemNames.of(sequence);

      // @ts-expect-error
      names.names = sequence;
      names.contains(name2);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('size', () => {
    it('delegates its inner collection instance', () => {
      const name1: StatsItemName = StatsItemName.of('');
      const name2: StatsItemName = StatsItemName.of('');
      const name3: StatsItemName = StatsItemName.of('');

      const sequence: MockSequence<StatsItemName> = new MockSequence([name1, name2, name3]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'size');
      const names: StatsItemNames = StatsItemNames.of(sequence);

      // @ts-expect-error
      names.names = sequence;
      names.size();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('forEach', () => {
    it('delegates its inner collection instance', () => {
      const name1: StatsItemName = StatsItemName.of('');
      const name2: StatsItemName = StatsItemName.of('');
      const name3: StatsItemName = StatsItemName.of('');

      const sequence: MockSequence<StatsItemName> = new MockSequence([name1, name2, name3]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'forEach');
      const names: StatsItemNames = StatsItemNames.of(sequence);

      // @ts-expect-error
      names.names = sequence;
      names.forEach(() => {
        // NOOP
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('isEmpty', () => {
    it('delegates its inner collection instance', () => {
      const name1: StatsItemName = StatsItemName.of('');
      const name2: StatsItemName = StatsItemName.of('');
      const name3: StatsItemName = StatsItemName.of('');

      const sequence: MockSequence<StatsItemName> = new MockSequence([name1, name2, name3]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'isEmpty');
      const names: StatsItemNames = StatsItemNames.of(sequence);

      // @ts-expect-error
      names.names = sequence;
      names.isEmpty();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('map', () => {
    it('delegates its inner collection instance', () => {
      const name1: StatsItemName = StatsItemName.of('');
      const name2: StatsItemName = StatsItemName.of('');
      const name3: StatsItemName = StatsItemName.of('');

      const sequence: MockSequence<StatsItemName> = new MockSequence([name1, name2, name3]);

      const names: StatsItemNames = StatsItemNames.of(sequence);

      const mapped: ImmutableSequence<string> = names.map<string>((name: StatsItemName) => {
        return name.get();
      });

      expect(mapped.size()).toBe(3);
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
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
      const name1: StatsItemName = StatsItemName.of('item 1');
      const name2: StatsItemName = StatsItemName.of('item 2');

      const names: StatsItemNames = StatsItemNames.ofArray([name1, name2]);

      expect(names.equals(names)).toBe(true);
    });

    it('delegates its inner collection instance', () => {
      const name1: StatsItemName = StatsItemName.of('');
      const name2: StatsItemName = StatsItemName.of('');
      const name3: StatsItemName = StatsItemName.of('');

      const sequence: MockSequence<StatsItemName> = new MockSequence([name1, name2, name3]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'equals');
      const names: StatsItemNames = StatsItemNames.of(sequence);

      // @ts-expect-error
      names.names = sequence;
      names.equals(StatsItemNames.empty());

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const names: StatsItemNames = StatsItemNames.ofArray([StatsItemName.of('item 1'), StatsItemName.of('item 2')]);

      expect(names.toJSON()).toStrictEqual(['item 1', 'item 2']);
    });
  });

  describe('iterator', () => {
    it('delegates its inner collection instance', () => {
      const name1: StatsItemName = StatsItemName.of('');
      const name2: StatsItemName = StatsItemName.of('');
      const name3: StatsItemName = StatsItemName.of('');

      const arr: Array<StatsItemName> = [name1, name2, name3];

      const sequence: MockSequence<StatsItemName> = new MockSequence(arr);

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
      const name1: StatsItemName = StatsItemName.of('');
      const name2: StatsItemName = StatsItemName.of('');
      const name3: StatsItemName = StatsItemName.of('');

      const sequence: MockSequence<StatsItemName> = new MockSequence([name1, name2, name3]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'every');
      const names: StatsItemNames = StatsItemNames.of(sequence);

      // @ts-expect-error
      names.names = sequence;
      names.every(() => {
        return true;
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('some', () => {
    it('delegates its inner collection instance', () => {
      const name1: StatsItemName = StatsItemName.of('');
      const name2: StatsItemName = StatsItemName.of('');
      const name3: StatsItemName = StatsItemName.of('');

      const sequence: MockSequence<StatsItemName> = new MockSequence([name1, name2, name3]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'some');
      const names: StatsItemNames = StatsItemNames.of(sequence);

      // @ts-expect-error
      names.names = sequence;
      names.some(() => {
        return true;
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('values', () => {
    it('delegates its inner collection instance', () => {
      const name1: StatsItemName = StatsItemName.of('');
      const name2: StatsItemName = StatsItemName.of('');
      const name3: StatsItemName = StatsItemName.of('');

      const sequence: MockSequence<StatsItemName> = new MockSequence([name1, name2, name3]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'values');
      const names: StatsItemNames = StatsItemNames.of(sequence);

      // @ts-expect-error
      names.names = sequence;
      names.values();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('filter', () => {
    it('delegates its inner collection instance', () => {
      const name1: StatsItemName = StatsItemName.of('');
      const name2: StatsItemName = StatsItemName.of('');
      const name3: StatsItemName = StatsItemName.of('');

      const sequence: Sequence<StatsItemName> = ImmutableSequence.ofArray([name1, name2, name3]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'filter');
      const names: StatsItemNames = StatsItemNames.of(sequence);

      // @ts-expect-error
      names.names = sequence;
      names.filter(() => {
        return true;
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('find', () => {
    it('delegates its inner collection instance', () => {
      const name1: StatsItemName = StatsItemName.of('');
      const name2: StatsItemName = StatsItemName.of('');
      const name3: StatsItemName = StatsItemName.of('');

      const sequence: MockSequence<StatsItemName> = new MockSequence([name1, name2, name3]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'find');
      const names: StatsItemNames = StatsItemNames.of(sequence);

      // @ts-expect-error
      names.names = sequence;
      names.find(() => {
        return true;
      });

      expect(spy).toHaveBeenCalled();
    });
  });
});
