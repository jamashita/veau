import { ImmutableSequence, MockASequence } from '@jamashita/publikum-collection';
import sinon, { SinonSpy } from 'sinon';

import { AsOfs } from '../../AsOf/AsOfs';
import { MockAsOf } from '../../AsOf/Mock/MockAsOf';
import { MockNumericalValue } from '../../NumericalValue/Mock/MockNumericalValue';
import { MockStatsItemName } from '../../StatsItem/Mock/MockStatsItemName';
import { StatsItemName } from '../../StatsItem/StatsItemName';
import { StatsItemNames } from '../../StatsItem/StatsItemNames';
import { MockStatsValue } from '../../StatsValue/Mock/MockStatsValue';
import { MockStatsValues } from '../../StatsValue/Mock/MockStatsValues';
import { MockStatsItemDisplay } from '../Mock/MockStatsItemDisplay';
import { StatsItemDisplay } from '../StatsItemDisplay';
import { StatsItemDisplays } from '../StatsItemDisplays';

describe('StatsItemDisplays', () => {
  describe('of', () => {
    it('returns StatsItem.empty() when the empty Sequence given', () => {
      expect(StatsItemDisplays.of(ImmutableSequence.empty<StatsItemDisplay>())).toBe(StatsItemDisplays.empty());
    });

    it('normal case', () => {
      const displays: StatsItemDisplays = StatsItemDisplays.of(
        ImmutableSequence.of<StatsItemDisplay>([new MockStatsItemDisplay(), new MockStatsItemDisplay()])
      );

      expect(displays).not.toBe(StatsItemDisplays.empty());
    });
  });

  describe('ofArray', () => {
    it('normal case', () => {
      const items: Array<StatsItemDisplay> = [
        new MockStatsItemDisplay(),
        new MockStatsItemDisplay(),
        new MockStatsItemDisplay()
      ];

      const displays: StatsItemDisplays = StatsItemDisplays.ofArray(items);

      expect(displays.size()).toBe(items.length);
      for (let i: number = 0; i < displays.size(); i++) {
        expect(displays.get(i)).toBe(items[i]);
      }
    });
  });

  describe('ofSpread', () => {
    it('normal case', () => {
      const display1: MockStatsItemDisplay = new MockStatsItemDisplay();
      const display2: MockStatsItemDisplay = new MockStatsItemDisplay();
      const display3: MockStatsItemDisplay = new MockStatsItemDisplay();

      const displays: StatsItemDisplays = StatsItemDisplays.ofSpread(display1, display2, display3);

      expect(displays.size()).toBe(3);
      expect(displays.get(0)).toBe(display1);
      expect(displays.get(1)).toBe(display2);
      expect(displays.get(2)).toBe(display3);
    });
  });

  describe('empty', () => {
    it('gives 0-length StatsItemDisplays', () => {
      expect(StatsItemDisplays.empty().isEmpty()).toBe(true);
    });
  });

  describe('get', () => {
    it('delegates its inner collection instance', async () => {
      const sequence: MockASequence<MockStatsItemDisplay> = new MockASequence<MockStatsItemDisplay>([
        new MockStatsItemDisplay(),
        new MockStatsItemDisplay()
      ]);

      const spy: SinonSpy = sinon.spy();

      sequence.get = spy;

      const displays: StatsItemDisplays = StatsItemDisplays.of(sequence);

      displays.get(0);

      expect(spy.called).toBe(true);
    });
  });

  describe('maxNameLength', () => {
    it('normal case', () => {
      const name1: MockStatsItemName = new MockStatsItemName('stats name 1');
      const name2: MockStatsItemName = new MockStatsItemName('stats name 11');
      const name3: MockStatsItemName = new MockStatsItemName('stats name 111');

      const displays: StatsItemDisplays = StatsItemDisplays.ofArray([
        new MockStatsItemDisplay({
          name: name1
        }),
        new MockStatsItemDisplay({
          name: name2
        }),
        new MockStatsItemDisplay({
          name: name3
        })
      ]);

      expect(displays.maxNameLength()).toBe(name3.length());
    });

    it('should give 0 when items are 0', () => {
      const displays: StatsItemDisplays = StatsItemDisplays.ofArray([]);

      expect(displays.maxNameLength()).toBe(0);
    });
  });

  describe('getAsOfs', () => {
    it('collects all AsOfs even if the date is same', () => {
      const statsItem1: MockStatsItemDisplay = new MockStatsItemDisplay({
        values: new MockStatsValues(
          new MockStatsValue({
            asOf: new MockAsOf({
              day: 1
            })
          }),
          new MockStatsValue({
            asOf: new MockAsOf({
              day: 2
            })
          }),
          new MockStatsValue({
            asOf: new MockAsOf({
              day: 3
            })
          })
        )
      });
      const statsItem2: MockStatsItemDisplay = new MockStatsItemDisplay({
        values: new MockStatsValues(
          new MockStatsValue({
            asOf: new MockAsOf({
              day: 2
            })
          }),
          new MockStatsValue({
            asOf: new MockAsOf({
              day: 3
            })
          }),
          new MockStatsValue({
            asOf: new MockAsOf({
              day: 4
            })
          })
        )
      });
      const statsItem3: MockStatsItemDisplay = new MockStatsItemDisplay({
        values: new MockStatsValues(
          new MockStatsValue({
            asOf: new MockAsOf({
              day: 4
            })
          }),
          new MockStatsValue({
            asOf: new MockAsOf({
              day: 5
            })
          })
        )
      });
      const displays: StatsItemDisplays = StatsItemDisplays.ofArray([statsItem1, statsItem2, statsItem3]);

      const asOfs: AsOfs = displays.getAsOfs();

      expect(asOfs.size()).toBe(8);
      expect(asOfs.get(0)?.toString()).toBe('2000-01-01');
      expect(asOfs.get(1)?.toString()).toBe('2000-01-02');
      expect(asOfs.get(2)?.toString()).toBe('2000-01-03');
      expect(asOfs.get(3)?.toString()).toBe('2000-01-02');
      expect(asOfs.get(4)?.toString()).toBe('2000-01-03');
      expect(asOfs.get(5)?.toString()).toBe('2000-01-04');
      expect(asOfs.get(6)?.toString()).toBe('2000-01-04');
      expect(asOfs.get(7)?.toString()).toBe('2000-01-05');
    });
  });

  describe('getNames', () => {
    it('normal case', () => {
      const name1: MockStatsItemName = new MockStatsItemName('stats name 1');
      const name2: MockStatsItemName = new MockStatsItemName('stats name 11');
      const name3: MockStatsItemName = new MockStatsItemName('stats name 111');

      const displays: StatsItemDisplays = StatsItemDisplays.ofArray([
        new MockStatsItemDisplay({
          name: name1
        }),
        new MockStatsItemDisplay({
          name: name2
        }),
        new MockStatsItemDisplay({
          name: name3
        })
      ]);

      const names: StatsItemNames = displays.getNames();

      expect(names.size()).toBe(3);
      expect(names.get(0)).toBe(name1);
      expect(names.get(1)).toBe(name2);
      expect(names.get(2)).toBe(name3);
    });
  });

  describe('areFilled', () => {
    it('returns true if the all items are filled', () => {
      const displays1: StatsItemDisplays = StatsItemDisplays.ofArray([
        new MockStatsItemDisplay({
          name: new MockStatsItemName('stats item 1')
        }),
        new MockStatsItemDisplay({
          name: new MockStatsItemName('stats item 2')
        })
      ]);
      const displays2: StatsItemDisplays = StatsItemDisplays.ofArray([
        new MockStatsItemDisplay({
          name: new MockStatsItemName('stats item 3')
        }),
        new MockStatsItemDisplay({
          name: StatsItemName.empty()
        })
      ]);

      expect(displays1.areFilled()).toBe(true);
      expect(displays2.areFilled()).toBe(false);
    });
  });

  describe('haveValues', () => {
    it('no items', () => {
      const displays: StatsItemDisplays = StatsItemDisplays.ofArray([]);

      expect(displays.haveValues()).toBe(false);
    });

    it('no values', () => {
      const displays1: StatsItemDisplays = StatsItemDisplays.ofArray([
        new MockStatsItemDisplay({
          values: new MockStatsValues()
        })
      ]);
      const displays2: StatsItemDisplays = StatsItemDisplays.ofArray([
        new MockStatsItemDisplay(),
        new MockStatsItemDisplay()
      ]);

      expect(displays1.haveValues()).toBe(false);
      expect(displays2.haveValues()).toBe(false);
    });

    it('have values', () => {
      const displays: StatsItemDisplays = StatsItemDisplays.ofArray([
        new MockStatsItemDisplay({
          values: new MockStatsValues(
            new MockStatsValue({
              value: new MockNumericalValue()
            })
          )
        })
      ]);

      expect(displays.haveValues()).toBe(true);
    });
  });

  describe('contains', () => {
    it('delegates its inner collection instance', async () => {
      const sequence: MockASequence<MockStatsItemDisplay> = new MockASequence<MockStatsItemDisplay>([
        new MockStatsItemDisplay(),
        new MockStatsItemDisplay()
      ]);

      const spy: SinonSpy = sinon.spy();

      sequence.contains = spy;

      const displays: StatsItemDisplays = StatsItemDisplays.of(sequence);

      displays.contains(new MockStatsItemDisplay());

      expect(spy.called).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('delegates its inner collection instance', async () => {
      const sequence: MockASequence<MockStatsItemDisplay> = new MockASequence<MockStatsItemDisplay>([
        new MockStatsItemDisplay(),
        new MockStatsItemDisplay()
      ]);

      const spy: SinonSpy = sinon.spy();

      sequence.isEmpty = spy;

      const displays: StatsItemDisplays = StatsItemDisplays.of(sequence);

      displays.isEmpty();

      expect(spy.called).toBe(true);
    });
  });

  describe('equals', () => {
    it('same instance', () => {
      const displays1: StatsItemDisplays = StatsItemDisplays.empty();

      expect(displays1.equals(displays1)).toBe(true);
    });

    it('delegates its inner collection instance', async () => {
      const sequence: MockASequence<MockStatsItemDisplay> = new MockASequence<MockStatsItemDisplay>([
        new MockStatsItemDisplay(),
        new MockStatsItemDisplay()
      ]);

      const spy: SinonSpy = sinon.spy();

      sequence.equals = spy;

      const displays: StatsItemDisplays = StatsItemDisplays.of(sequence);

      displays.equals(StatsItemDisplays.empty());

      expect(spy.called).toBe(true);
    });
  });

  describe('toString', () => {
    it('delegates its inner collection instance', async () => {
      const sequence: MockASequence<MockStatsItemDisplay> = new MockASequence<MockStatsItemDisplay>([
        new MockStatsItemDisplay(),
        new MockStatsItemDisplay()
      ]);

      const spy: SinonSpy = sinon.spy();

      sequence.toString = spy;

      const displays: StatsItemDisplays = StatsItemDisplays.of(sequence);

      displays.toString();

      expect(spy.called).toBe(true);
    });
  });

  describe('iterator', () => {
    it('delegates its inner collection instance', async () => {
      const sequence: MockASequence<MockStatsItemDisplay> = new MockASequence<MockStatsItemDisplay>([
        new MockStatsItemDisplay(),
        new MockStatsItemDisplay()
      ]);

      const displays: StatsItemDisplays = StatsItemDisplays.of(sequence);
      let i: number = 0;

      for (const pair of displays) {
        expect(pair.getValue()).toBe(displays.get(i));
        i++;
      }
    });
  });

  describe('every', () => {
    it('delegates its inner collection instance', async () => {
      const sequence: MockASequence<MockStatsItemDisplay> = new MockASequence<MockStatsItemDisplay>([
        new MockStatsItemDisplay(),
        new MockStatsItemDisplay()
      ]);

      const spy: SinonSpy = sinon.spy();

      sequence.every = spy;

      const displays: StatsItemDisplays = StatsItemDisplays.of(sequence);

      displays.every(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('some', () => {
    it('delegates its inner collection instance', async () => {
      const sequence: MockASequence<MockStatsItemDisplay> = new MockASequence<MockStatsItemDisplay>([
        new MockStatsItemDisplay(),
        new MockStatsItemDisplay()
      ]);

      const spy: SinonSpy = sinon.spy();

      sequence.some = spy;

      const displays: StatsItemDisplays = StatsItemDisplays.of(sequence);

      displays.some(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });
});
