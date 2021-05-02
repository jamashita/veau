import { ImmutableSequence, MockSequence } from '@jamashita/lluvia-collection';
import sinon, { SinonSpy } from 'sinon';
import { StatsOutline } from '../../StatsOutline/StatsOutline';
import { MockStatsListItem } from '../Mock/MockStatsListItem';
import { MockStatsListItems } from '../Mock/MockStatsListItems';
import { StatsListItem } from '../StatsListItem';
import { StatsListItems } from '../StatsListItems';

describe('StatsListItems', () => {
  describe('of', () => {
    it('when the ImmutableSequence is zero size, returns empty', () => {
      expect.assertions(1);

      expect(StatsListItems.of(ImmutableSequence.empty<StatsListItem>())).toBe(StatsListItems.empty());
    });

    it('normal case', () => {
      expect.assertions(3);

      const sequence: ImmutableSequence<MockStatsListItem> = ImmutableSequence.ofArray<MockStatsListItem>([
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
      expect.assertions(1);

      expect(StatsListItems.ofArray([])).toBe(StatsListItems.empty());
    });

    it('normal case', () => {
      expect.assertions(3);

      const is: Array<StatsListItem> = [new MockStatsListItem(), new MockStatsListItem()];

      const items: StatsListItems = StatsListItems.ofArray(is);

      expect(items.size()).toBe(is.length);
      for (let i: number = 0; i < items.size(); i++) {
        expect(items.get(i)).toBe(is[i]);
      }
    });
  });

  describe('ofSpread', () => {
    it('when no arguments given, returns StatsListItems.empty()', () => {
      expect.assertions(1);

      expect(StatsListItems.ofSpread()).toBe(StatsListItems.empty());
    });

    it('normal case', () => {
      expect.assertions(3);

      const statsListItem1: MockStatsListItem = new MockStatsListItem();
      const statsListItem2: MockStatsListItem = new MockStatsListItem();

      const statsListItems: StatsListItems = StatsListItems.ofSpread(statsListItem1, statsListItem2);

      expect(statsListItems.size()).toBe(2);
      expect(statsListItems.get(0)).toBe(statsListItem1);
      expect(statsListItems.get(1)).toBe(statsListItem2);
    });
  });

  describe('empty', () => {
    it('generates 0-length StatsListItems', () => {
      expect.assertions(1);

      expect(StatsListItems.empty().size()).toBe(0);
    });

    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(StatsListItems.empty()).toBe(StatsListItems.empty());
    });
  });

  describe('get', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const item1: MockStatsListItem = new MockStatsListItem();
      const item2: MockStatsListItem = new MockStatsListItem();
      const item3: MockStatsListItem = new MockStatsListItem();

      const sequence: MockSequence<MockStatsListItem> = new MockSequence<MockStatsListItem>([item1, item2, item3]);

      const spy: SinonSpy = sinon.spy();
      const items: StatsListItems = StatsListItems.of(sequence);

      // @ts-expect-error
      items.items.get = spy;
      items.get(0);

      expect(spy.called).toBe(true);
    });
  });

  describe('contains', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const item1: MockStatsListItem = new MockStatsListItem();
      const item2: MockStatsListItem = new MockStatsListItem();
      const item3: MockStatsListItem = new MockStatsListItem();

      const sequence: MockSequence<MockStatsListItem> = new MockSequence<MockStatsListItem>([item1, item2, item3]);

      const spy: SinonSpy = sinon.spy();
      const items: StatsListItems = StatsListItems.of(sequence);

      // @ts-expect-error
      items.items.contains = spy;
      items.contains(item1);

      expect(spy.called).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const item1: MockStatsListItem = new MockStatsListItem();
      const item2: MockStatsListItem = new MockStatsListItem();
      const item3: MockStatsListItem = new MockStatsListItem();

      const sequence: MockSequence<MockStatsListItem> = new MockSequence<MockStatsListItem>([item1, item2, item3]);

      const spy: SinonSpy = sinon.spy();
      const items: StatsListItems = StatsListItems.of(sequence);

      // @ts-expect-error
      items.items.isEmpty = spy;
      items.isEmpty();

      expect(spy.called).toBe(true);
    });
  });

  describe('size', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const item1: MockStatsListItem = new MockStatsListItem();
      const item2: MockStatsListItem = new MockStatsListItem();
      const item3: MockStatsListItem = new MockStatsListItem();

      const sequence: MockSequence<MockStatsListItem> = new MockSequence<MockStatsListItem>([item1, item2, item3]);

      const spy: SinonSpy = sinon.spy();
      const items: StatsListItems = StatsListItems.of(sequence);

      // @ts-expect-error
      items.items.size = spy;
      items.size();

      expect(spy.called).toBe(true);
    });
  });

  describe('forEach', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const item1: MockStatsListItem = new MockStatsListItem();
      const item2: MockStatsListItem = new MockStatsListItem();
      const item3: MockStatsListItem = new MockStatsListItem();

      const sequence: MockSequence<MockStatsListItem> = new MockSequence<MockStatsListItem>([item1, item2, item3]);

      const spy: SinonSpy = sinon.spy();
      const items: StatsListItems = StatsListItems.of(sequence);

      // @ts-expect-error
      items.items.forEach = spy;
      items.forEach(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('map', () => {
    it('normal case', () => {
      expect.assertions(1);

      const item1: MockStatsListItem = new MockStatsListItem();
      const item2: MockStatsListItem = new MockStatsListItem();
      const item3: MockStatsListItem = new MockStatsListItem();

      const sequence: MockSequence<MockStatsListItem> = new MockSequence<MockStatsListItem>([item1, item2, item3]);

      const items: StatsListItems = StatsListItems.of(sequence);

      const arr: Array<StatsOutline> = [...items.values()].map<StatsOutline>((item: StatsListItem) => {
        return item.getOutline();
      });

      expect(arr).toHaveLength(3);
    });
  });

  describe('equals', () => {
    it('returns true if the same instance given', () => {
      expect.assertions(1);

      const item1: MockStatsListItem = new MockStatsListItem();
      const item2: MockStatsListItem = new MockStatsListItem();

      const items: StatsListItems = StatsListItems.ofArray([item1, item2]);

      expect(items.equals(items)).toBe(true);
    });

    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const item1: MockStatsListItem = new MockStatsListItem();
      const item2: MockStatsListItem = new MockStatsListItem();
      const item3: MockStatsListItem = new MockStatsListItem();

      const sequence: MockSequence<MockStatsListItem> = new MockSequence<MockStatsListItem>([item1, item2, item3]);

      const spy: SinonSpy = sinon.spy();
      const items: StatsListItems = StatsListItems.of(sequence);

      // @ts-expect-error
      items.items.equals = spy;
      items.equals(new MockStatsListItems());

      expect(spy.called).toBe(true);
    });
  });

  describe('toString', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const item1: MockStatsListItem = new MockStatsListItem();
      const item2: MockStatsListItem = new MockStatsListItem();
      const item3: MockStatsListItem = new MockStatsListItem();

      const sequence: MockSequence<MockStatsListItem> = new MockSequence<MockStatsListItem>([item1, item2, item3]);

      const spy: SinonSpy = sinon.spy();
      const items: StatsListItems = StatsListItems.of(sequence);

      // @ts-expect-error
      items.items.toString = spy;
      items.toString();

      expect(spy.called).toBe(true);
    });
  });

  describe('iterator', () => {
    it('normal case', () => {
      expect.assertions(3);

      const item1: MockStatsListItem = new MockStatsListItem();
      const item2: MockStatsListItem = new MockStatsListItem();
      const item3: MockStatsListItem = new MockStatsListItem();

      const arr: Array<MockStatsListItem> = [item1, item2, item3];

      const sequence: MockSequence<MockStatsListItem> = new MockSequence<MockStatsListItem>(arr);

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
      expect.assertions(1);

      const item1: MockStatsListItem = new MockStatsListItem();
      const item2: MockStatsListItem = new MockStatsListItem();
      const item3: MockStatsListItem = new MockStatsListItem();

      const sequence: MockSequence<MockStatsListItem> = new MockSequence<MockStatsListItem>([item1, item2, item3]);

      const spy: SinonSpy = sinon.spy();
      const items: StatsListItems = StatsListItems.of(sequence);

      // @ts-expect-error
      items.items.every = spy;
      items.every(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('some', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const item1: MockStatsListItem = new MockStatsListItem();
      const item2: MockStatsListItem = new MockStatsListItem();
      const item3: MockStatsListItem = new MockStatsListItem();

      const sequence: MockSequence<MockStatsListItem> = new MockSequence<MockStatsListItem>([item1, item2, item3]);

      const spy: SinonSpy = sinon.spy();
      const items: StatsListItems = StatsListItems.of(sequence);

      // @ts-expect-error
      items.items.some = spy;
      items.some(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('values', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const item1: MockStatsListItem = new MockStatsListItem();
      const item2: MockStatsListItem = new MockStatsListItem();
      const item3: MockStatsListItem = new MockStatsListItem();

      const sequence: MockSequence<MockStatsListItem> = new MockSequence<MockStatsListItem>([item1, item2, item3]);

      const spy: SinonSpy = sinon.spy();
      const items: StatsListItems = StatsListItems.of(sequence);

      // @ts-expect-error
      items.items.values = spy;
      items.values();

      expect(spy.called).toBe(true);
    });
  });
});
