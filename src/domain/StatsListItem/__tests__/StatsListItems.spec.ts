import { ImmutableSequence, MockSequence, Sequence } from '@jamashita/lluvia-sequence';
import { Term } from '../../Term/Term';
import { MockStatsListItem } from '../mock/MockStatsListItem';
import { StatsListItem } from '../StatsListItem';
import { StatsListItems } from '../StatsListItems';

describe('StatsListItems', () => {
  describe('of', () => {
    it('when the ImmutableSequence is zero size, returns empty', () => {
      expect(StatsListItems.of(ImmutableSequence.empty())).toBe(StatsListItems.empty());
    });

    it('normal case', () => {
      const sequence: ImmutableSequence<MockStatsListItem> = ImmutableSequence.ofArray([
        new MockStatsListItem(),
        new MockStatsListItem()
      ]);

      const items: StatsListItems = StatsListItems.of(sequence);

      expect(items.size()).toBe(sequence.size());
      for (let i: number = 0; i < items.size(); i++) {
        expect(items.get(i)).toBe(sequence.get(i));
      }
    });
  });

  describe('ofArray', () => {
    it('when empty Array given, returns StatsListItems.empty()', () => {
      expect(StatsListItems.ofArray([])).toBe(StatsListItems.empty());
    });

    it('normal case', () => {
      const is: Array<StatsListItem> = [new MockStatsListItem(), new MockStatsListItem()];

      const items: StatsListItems = StatsListItems.ofArray(is);

      expect(items.size()).toBe(is.length);
      for (let i: number = 0; i < items.size(); i++) {
        expect(items.get(i)).toBe(is[i]);
      }
    });
  });

  describe('empty', () => {
    it('generates 0-length StatsListItems', () => {
      expect(StatsListItems.empty().size()).toBe(0);
    });

    it('returns singleton instance', () => {
      expect(StatsListItems.empty()).toBe(StatsListItems.empty());
    });
  });

  describe('get', () => {
    it('delegates its inner collection instance', () => {
      const item1: MockStatsListItem = new MockStatsListItem();
      const item2: MockStatsListItem = new MockStatsListItem();
      const item3: MockStatsListItem = new MockStatsListItem();

      const sequence: MockSequence<MockStatsListItem> = new MockSequence([item1, item2, item3]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'get');
      const items: StatsListItems = StatsListItems.of(sequence);

      // @ts-expect-error
      items.items = sequence;
      items.get(0);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('contains', () => {
    it('delegates its inner collection instance', () => {
      const item1: MockStatsListItem = new MockStatsListItem();
      const item2: MockStatsListItem = new MockStatsListItem();
      const item3: MockStatsListItem = new MockStatsListItem();

      const sequence: MockSequence<MockStatsListItem> = new MockSequence([item1, item2, item3]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'contains');
      const items: StatsListItems = StatsListItems.of(sequence);

      // @ts-expect-error
      items.items = sequence;
      items.contains(item1);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('isEmpty', () => {
    it('delegates its inner collection instance', () => {
      const item1: MockStatsListItem = new MockStatsListItem();
      const item2: MockStatsListItem = new MockStatsListItem();
      const item3: MockStatsListItem = new MockStatsListItem();

      const sequence: MockSequence<MockStatsListItem> = new MockSequence([item1, item2, item3]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'isEmpty');
      const items: StatsListItems = StatsListItems.of(sequence);

      // @ts-expect-error
      items.items = sequence;
      items.isEmpty();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('size', () => {
    it('delegates its inner collection instance', () => {
      const item1: MockStatsListItem = new MockStatsListItem();
      const item2: MockStatsListItem = new MockStatsListItem();
      const item3: MockStatsListItem = new MockStatsListItem();

      const sequence: MockSequence<MockStatsListItem> = new MockSequence([item1, item2, item3]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'size');
      const items: StatsListItems = StatsListItems.of(sequence);

      // @ts-expect-error
      items.items = sequence;
      items.size();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('forEach', () => {
    it('delegates its inner collection instance', () => {
      const item1: MockStatsListItem = new MockStatsListItem();
      const item2: MockStatsListItem = new MockStatsListItem();
      const item3: MockStatsListItem = new MockStatsListItem();

      const sequence: MockSequence<MockStatsListItem> = new MockSequence([item1, item2, item3]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'forEach');
      const items: StatsListItems = StatsListItems.of(sequence);

      // @ts-expect-error
      items.items = sequence;
      items.forEach(() => {
        // NOOP
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      const items: StatsListItems = StatsListItems.empty();

      expect(items.equals(null)).toBe(false);
      expect(items.equals(undefined)).toBe(false);
      expect(items.equals('')).toBe(false);
      expect(items.equals('123')).toBe(false);
      expect(items.equals('abcd')).toBe(false);
      expect(items.equals(123)).toBe(false);
      expect(items.equals(0)).toBe(false);
      expect(items.equals(-12)).toBe(false);
      expect(items.equals(0.3)).toBe(false);
      expect(items.equals(false)).toBe(false);
      expect(items.equals(true)).toBe(false);
      expect(items.equals(Symbol('p'))).toBe(false);
      expect(items.equals(20n)).toBe(false);
      expect(items.equals({})).toBe(false);
      expect(items.equals([])).toBe(false);
      expect(items.equals(Object.create(null))).toBe(false);
    });

    it('returns true if the same instance given', () => {
      const item1: MockStatsListItem = new MockStatsListItem();
      const item2: MockStatsListItem = new MockStatsListItem();

      const items: StatsListItems = StatsListItems.ofArray([item1, item2]);

      expect(items.equals(items)).toBe(true);
    });

    it('delegates its inner collection instance', () => {
      const item1: MockStatsListItem = new MockStatsListItem();
      const item2: MockStatsListItem = new MockStatsListItem();
      const item3: MockStatsListItem = new MockStatsListItem();

      const sequence: MockSequence<MockStatsListItem> = new MockSequence([item1, item2, item3]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'equals');
      const items: StatsListItems = StatsListItems.of(sequence);

      // @ts-expect-error
      items.items = sequence;
      items.equals(StatsListItems.empty());

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('iterator', () => {
    it('normal case', () => {
      const item1: MockStatsListItem = new MockStatsListItem();
      const item2: MockStatsListItem = new MockStatsListItem();
      const item3: MockStatsListItem = new MockStatsListItem();

      const arr: Array<MockStatsListItem> = [item1, item2, item3];

      const sequence: MockSequence<MockStatsListItem> = new MockSequence(arr);

      const items: StatsListItems = StatsListItems.of(sequence);
      let i: number = 0;

      for (const [, v] of items) {
        expect(v).toBe(arr[i]);
        i++;
      }
    });
  });

  describe('every', () => {
    it('delegates its inner collection instance', () => {
      const item1: MockStatsListItem = new MockStatsListItem();
      const item2: MockStatsListItem = new MockStatsListItem();
      const item3: MockStatsListItem = new MockStatsListItem();

      const sequence: MockSequence<MockStatsListItem> = new MockSequence([item1, item2, item3]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'every');
      const items: StatsListItems = StatsListItems.of(sequence);

      // @ts-expect-error
      items.items = sequence;
      items.every(() => {
        return true;
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('some', () => {
    it('delegates its inner collection instance', () => {
      const item1: MockStatsListItem = new MockStatsListItem();
      const item2: MockStatsListItem = new MockStatsListItem();
      const item3: MockStatsListItem = new MockStatsListItem();

      const sequence: MockSequence<MockStatsListItem> = new MockSequence([item1, item2, item3]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'some');
      const items: StatsListItems = StatsListItems.of(sequence);

      // @ts-expect-error
      items.items = sequence;
      items.some(() => {
        return true;
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('values', () => {
    it('delegates its inner collection instance', () => {
      const item1: MockStatsListItem = new MockStatsListItem();
      const item2: MockStatsListItem = new MockStatsListItem();
      const item3: MockStatsListItem = new MockStatsListItem();

      const sequence: MockSequence<MockStatsListItem> = new MockSequence([item1, item2, item3]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'values');
      const items: StatsListItems = StatsListItems.of(sequence);

      // @ts-expect-error
      items.items = sequence;
      items.values();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('filter', () => {
    it('delegates its inner collection instance', () => {
      const item1: MockStatsListItem = new MockStatsListItem();
      const item2: MockStatsListItem = new MockStatsListItem();
      const item3: MockStatsListItem = new MockStatsListItem();

      const sequence: Sequence<MockStatsListItem> = ImmutableSequence.ofArray([item1, item2, item3]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'filter');
      const items: StatsListItems = StatsListItems.of(sequence);

      // @ts-expect-error
      items.items = sequence;
      items.filter(() => {
        return true;
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('find', () => {
    it('delegates its inner collection instance', () => {
      const item1: MockStatsListItem = new MockStatsListItem();
      const item2: MockStatsListItem = new MockStatsListItem();
      const item3: MockStatsListItem = new MockStatsListItem();

      const sequence: MockSequence<MockStatsListItem> = new MockSequence([item1, item2, item3]);

      const spy: jest.SpyInstance = jest.spyOn(sequence, 'find');
      const items: StatsListItems = StatsListItems.of(sequence);

      // @ts-expect-error
      items.items = sequence;
      items.find(() => {
        return true;
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('map', () => {
    it('does not affect the length, only change the instance', () => {
      const item1: MockStatsListItem = new MockStatsListItem();
      const item2: MockStatsListItem = new MockStatsListItem();
      const item3: MockStatsListItem = new MockStatsListItem();

      const sequence: MockSequence<MockStatsListItem> = new MockSequence([item1, item2, item3]);

      const items: StatsListItems = StatsListItems.of(sequence);

      const mapped: ImmutableSequence<Term> = items.map<Term>((i: StatsListItem) => {
        return i.getTerm();
      });

      expect(mapped.size()).toBe(3);
    });
  });
});
