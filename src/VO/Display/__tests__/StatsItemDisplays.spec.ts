import { ImmutableSequence, MockASequence } from '@jamashita/publikum-collection';
import { SinonSpy } from 'sinon';

import { AsOfs } from '../../../VO/AsOf/AsOfs';
import { MockAsOf } from '../../../VO/AsOf/Mock/MockAsOf';
import { MockNumericalValue } from '../../../VO/NumericalValue/Mock/MockNumericalValue';
import { MockStatsItemName } from '../../../VO/StatsItem/Mock/MockStatsItemName';
import { StatsItemName } from '../../../VO/StatsItem/StatsItemName';
import { StatsItemNames } from '../../../VO/StatsItem/StatsItemNames';
import { MockStatsValue } from '../../../VO/StatsValue/Mock/MockStatsValue';
import { MockStatsValues } from '../../../VO/StatsValue/Mock/MockStatsValues';
import { MockStatsItemDisplay } from '../Mock/MockStatsItemDisplay';
import { StatsItemDisplay } from '../StatsItemDisplay';

import { StatsItemDisplays } from '../../../VO/Display/StatsItemDisplays';
import sinon from 'sinon';

describe('StatsItemDisplays', () => {
  describe('of', () => {
    it('returns StatsItem.empty() when the empty Sequence given', () => {
      expect(StatsItemDisplays.of(ImmutableSequence.empty<StatsItemDisplay>())).toBe(StatsItemDisplays.empty());
    });

    it('normal case', () => {
      const display: StatsItemDisplays = StatsItemDisplays.of(
        ImmutableSequence.of<StatsItemDisplay>([new MockStatsItemDisplay(), new MockStatsItemDisplay()])
      );

      expect(display).not.toBe(StatsItemDisplays.empty());
    });
  });

  describe('ofArray', () => {
    it('normal case', () => {
      const items: Array<StatsItemDisplay> = [
        new MockStatsItemDisplay(),
        new MockStatsItemDisplay(),
        new MockStatsItemDisplay()
      ];

      const display: StatsItemDisplays = StatsItemDisplays.ofArray(items);

      expect(display.size()).toBe(items.length);
      for (let i: number = 0; i < display.size(); i++) {
        expect(display.get(i)).toBe(items[i]);
      }
    });
  });

  describe('ofSpread', () => {
    it('normal case', () => {
      const item1: MockStatsItemDisplay = new MockStatsItemDisplay();
      const item2: MockStatsItemDisplay = new MockStatsItemDisplay();
      const item3: MockStatsItemDisplay = new MockStatsItemDisplay();

      const display: StatsItemDisplays = StatsItemDisplays.ofSpread(item1, item2, item3);

      expect(display.size()).toBe(3);
      expect(display.get(0)).toBe(item1);
      expect(display.get(1)).toBe(item2);
      expect(display.get(2)).toBe(item3);
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

      const display: StatsItemDisplays = StatsItemDisplays.ofArray([
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

      expect(display.maxNameLength()).toBe(name3.length());
    });

    it('should give 0 when items are 0', () => {
      const display: StatsItemDisplays = StatsItemDisplays.ofArray([]);

      expect(display.maxNameLength()).toBe(0);
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
      const display: StatsItemDisplays = StatsItemDisplays.ofArray([statsItem1, statsItem2, statsItem3]);

      const asOfs: AsOfs = display.getAsOfs();

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

      const display: StatsItemDisplays = StatsItemDisplays.ofArray([
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

      const names: StatsItemNames = display.getNames();

      expect(names.size()).toBe(3);
      expect(names.get(0)).toBe(name1);
      expect(names.get(1)).toBe(name2);
      expect(names.get(2)).toBe(name3);
    });
  });

  describe('areFilled', () => {
    it('returns true if the all items are filled', () => {
      const display1: StatsItemDisplays = StatsItemDisplays.ofArray([
        new MockStatsItemDisplay({
          name: new MockStatsItemName('stats item 1')
        }),
        new MockStatsItemDisplay({
          name: new MockStatsItemName('stats item 2')
        })
      ]);
      const display2: StatsItemDisplays = StatsItemDisplays.ofArray([
        new MockStatsItemDisplay({
          name: new MockStatsItemName('stats item 3')
        }),
        new MockStatsItemDisplay({
          name: StatsItemName.empty()
        })
      ]);

      expect(display1.areFilled()).toBe(true);
      expect(display2.areFilled()).toBe(false);
    });
  });

  describe('haveValues', () => {
    it('no items', () => {
      const display: StatsItemDisplays = StatsItemDisplays.ofArray([]);

      expect(display.haveValues()).toBe(false);
    });

    it('no values', () => {
      const display1: StatsItemDisplays = StatsItemDisplays.ofArray([
        new MockStatsItemDisplay({
          values: new MockStatsValues()
        })
      ]);
      const display2: StatsItemDisplays = StatsItemDisplays.ofArray([
        new MockStatsItemDisplay(),
        new MockStatsItemDisplay()
      ]);

      expect(display1.haveValues()).toBe(false);
      expect(display2.haveValues()).toBe(false);
    });

    it('have values', () => {
      const display: StatsItemDisplays = StatsItemDisplays.ofArray([
        new MockStatsItemDisplay({
          values: new MockStatsValues(
            new MockStatsValue({
              value: new MockNumericalValue()
            })
          )
        })
      ]);

      expect(display.haveValues()).toBe(true);
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
    it('same isntance', () => {
      const display1: StatsItemDisplays = StatsItemDisplays.empty();

      expect(display1.equals(display1)).toBe(true);
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
});
