import { ImmutableSequence, MockSequence } from '@jamashita/publikum-collection';
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

      const sequence: ImmutableSequence<MockStatsListItem> = ImmutableSequence.of<MockStatsListItem>([
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

      sequence.get = spy;

      const items: StatsListItems = StatsListItems.of(sequence);

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

      sequence.contains = spy;

      const items: StatsListItems = StatsListItems.of(sequence);

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

      sequence.isEmpty = spy;

      const items: StatsListItems = StatsListItems.of(sequence);

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

      sequence.size = spy;

      const items: StatsListItems = StatsListItems.of(sequence);

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

      sequence.forEach = spy;

      const items: StatsListItems = StatsListItems.of(sequence);

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

      const arr: Array<StatsOutline> = items.map<StatsOutline>((item: StatsListItem) => {
        return item.getOutline();
      });

      expect(arr).toHaveLength(3);
    });
  });

  describe('equals', () => {
    it('same instance', () => {
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

      sequence.equals = spy;

      const items: StatsListItems = StatsListItems.of(sequence);

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

      sequence.toString = spy;

      const items: StatsListItems = StatsListItems.of(sequence);

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

      for (const pair of items) {
        expect(pair.getValue()).toBe(arr[i]);
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

      sequence.every = spy;

      const items: StatsListItems = StatsListItems.of(sequence);

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

      sequence.some = spy;

      const items: StatsListItems = StatsListItems.of(sequence);

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

      sequence.values = spy;

      const items: StatsListItems = StatsListItems.of(sequence);

      items.values();

      expect(spy.called).toBe(true);
    });
  });
});
