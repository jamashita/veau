import { ImmutableSequence } from '@jamashita/publikum-collection';

import { AsOfs } from '../../../VO/AsOf/AsOfs';
import { MockAsOf } from '../../../VO/AsOf/Mock/MockAsOf';
import { MockNumericalValue } from '../../../VO/NumericalValue/Mock/MockNumericalValue';
import { MockStatsItemID } from '../../../VO/StatsItem/Mock/MockStatsItemID';
import { MockStatsItemName } from '../../../VO/StatsItem/Mock/MockStatsItemName';
import { StatsItemID } from '../../../VO/StatsItem/StatsItemID';
import { StatsItemName } from '../../../VO/StatsItem/StatsItemName';
import { StatsItemNames } from '../../../VO/StatsItem/StatsItemNames';
import { MockStatsValue } from '../../../VO/StatsValue/Mock/MockStatsValue';
import { MockStatsValues } from '../../../VO/StatsValue/Mock/MockStatsValues';
import { StatsValues } from '../../../VO/StatsValue/StatsValues';
import { MockStatsItemDisplay } from '../Mock/MockStatsItemDisplay';
import { StatsItemDisplay } from '../StatsItemDisplay';
import { StatsItemsDisplay } from '../StatsItemsDisplay';

  describe('of', () => {
    it('returns StatsItem.empty() when the empty Sequence given', () => {
      expect(StatsItemsDisplay.of(ImmutableSequence.empty<StatsItemDisplay>())).toBe(StatsItemsDisplay.empty());
    });

    it('normal case', () => {
      const statsItems: StatsItemsDisplay = StatsItemsDisplay.of(
        ImmutableSequence.of<StatsItemDisplay>([new MockStatsItemDisplay(), new MockStatsItemDisplay()])
      );

      expect(statsItems).not.toBe(StatsItemsDisplay.empty());
    });
  });

  describe('ofArray', () => {
    it('normal case', () => {
      const items: Array<StatsItemDisplay> = [new MockStatsItemDisplay(), new MockStatsItemDisplay(), new MockStatsItemDisplay()];

      const statsItems: StatsItemsDisplay = StatsItemsDisplay.ofArray(items);

      expect(statsItems.size()).toBe(items.length);
      for (let i: number = 0; i < statsItems.size(); i++) {
        expect(statsItems.get(i)).toBe(items[i]);
      }
    });
  });

  describe('ofSpread', () => {
    it('normal case', () => {
      const item1: MockStatsItemDisplay = new MockStatsItemDisplay();
      const item2: MockStatsItemDisplay = new MockStatsItemDisplay();
      const item3: MockStatsItemDisplay = new MockStatsItemDisplay();

      const statsItems: StatsItemsDisplay = StatsItemsDisplay.ofSpread(item1, item2, item3);

      expect(statsItems.size()).toBe(3);
      expect(statsItems.get(0)).toBe(item1);
      expect(statsItems.get(1)).toBe(item2);
      expect(statsItems.get(2)).toBe(item3);
    });
  });

  describe('empty', () => {
    it('gives 0-length StatsItemsDisplay', () => {
      expect(StatsItemsDisplay.empty().isEmpty()).toBe(true);
    });
  });

  describe('get', () => {
    it('returns Language instance at the correct index', () => {
      const items: Array<MockStatsItemDisplay> = [new MockStatsItemDisplay(), new MockStatsItemDisplay()];

      const statsItems: StatsItemsDisplay = StatsItemsDisplay.ofArray(items);

      expect(statsItems.size()).toBe(items.length);
      for (let i: number = 0; i < statsItems.size(); i++) {
        expect(statsItems.get(i)).toBe(items[i]);
      }
    });

    it('returns null when the index is out of range', () => {
      const items: StatsItemsDisplay = StatsItemsDisplay.empty();

      expect(items.get(-1)).toBe(null);
      expect(items.get(0)).toBe(null);
    });
  });

  describe('maxNameLength', () => {
    it('normal case', () => {
      const name1: MockStatsItemName = new MockStatsItemName('stats name 1');
      const name2: MockStatsItemName = new MockStatsItemName('stats name 11');
      const name3: MockStatsItemName = new MockStatsItemName('stats name 111');

      const statsItems: StatsItemsDisplay = StatsItemsDisplay.ofArray([
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

      expect(statsItems.maxNameLength()).toBe(name3.length());
    });

    it('should give 0 when items are 0', () => {
      const statsItems: StatsItemsDisplay = StatsItemsDisplay.ofArray([]);

      expect(statsItems.maxNameLength()).toBe(0);
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
      const statsItems: StatsItemsDisplay = StatsItemsDisplay.ofArray([statsItem1, statsItem2, statsItem3]);

      const asOfs: AsOfs = statsItems.getAsOfs();

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

      const statsItems: StatsItemsDisplay = StatsItemsDisplay.ofArray([
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

      const names: StatsItemNames = statsItems.getNames();

      expect(names.size()).toBe(3);
      expect(names.get(0)).toBe(name1);
      expect(names.get(1)).toBe(name2);
      expect(names.get(2)).toBe(name3);
    });
  });

  describe('areFilled', () => {
    it('returns true if the all items are filled', () => {
      const statsItems1: StatsItemsDisplay = StatsItemsDisplay.ofArray([
        new MockStatsItemDisplay({
          name: new MockStatsItemName('stats item 1')
        }),
        new MockStatsItemDisplay({
          name: new MockStatsItemName('stats item 2')
        })
      ]);
      const statsItems2: StatsItemsDisplay = StatsItemsDisplay.ofArray([
        new MockStatsItemDisplay({
          name: new MockStatsItemName('stats item 3')
        })
      ]);

      expect(statsItems1.areFilled()).toBe(true);
      expect(statsItems2.areFilled()).toBe(false);
    });
  });

  describe('haveValues', () => {
    it('no items', () => {
      const statsItems: StatsItemsDisplay = StatsItemsDisplay.ofArray([]);

      expect(statsItems.haveValues()).toBe(false);
    });

    it('no values', () => {
      const statsItems1: StatsItemsDisplay = StatsItemsDisplay.ofArray([
        new MockStatsItemDisplay({
          values: new MockStatsValues()
        })
      ]);
      const statsItems2: StatsItemsDisplay = StatsItemsDisplay.ofArray([new MockStatsItemDisplay(), new MockStatsItemDisplay()]);

      expect(statsItems1.haveValues()).toBe(false);
      expect(statsItems2.haveValues()).toBe(false);
    });

    it('have values', () => {
      const statsItems: StatsItemsDisplay = StatsItemsDisplay.ofArray([
        new MockStatsItemDisplay({
          values: new MockStatsValues(
            new MockStatsValue({
              value: new MockNumericalValue()
            })
          )
        })
      ]);

      expect(statsItems.haveValues()).toBe(true);
    });
  });

  describe('contains', () => {
    it('returns true if the element exists', () => {
      const statsItemID1: MockStatsItemID = new MockStatsItemID();
      const statsItemID2: MockStatsItemID = new MockStatsItemID();
      const statsItemID3: MockStatsItemID = new MockStatsItemID();
      const statsItem1: MockStatsItemDisplay = new MockStatsItemDisplay({
        statsItemID: statsItemID1
      });
      const statsItem2: MockStatsItemDisplay = new MockStatsItemDisplay({
        statsItemID: statsItemID2
      });
      const statsItem3: MockStatsItemDisplay = new MockStatsItemDisplay({
        statsItemID: statsItemID3
      });
      const statsItem4: MockStatsItemDisplay = new MockStatsItemDisplay({
        statsItemID: statsItemID1
      });
      const statsItems: StatsItemsDisplay = StatsItemsDisplay.ofArray([statsItem1, statsItem2]);

      expect(statsItems.contains(statsItem1)).toBe(true);
      expect(statsItems.contains(statsItem2)).toBe(true);
      expect(statsItems.contains(statsItem3)).toBe(false);
      expect(statsItems.contains(statsItem4)).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements are 0', () => {
      const statsItems1: StatsItemsDisplay = StatsItemsDisplay.ofArray([new MockStatsItemDisplay(), new MockStatsItemDisplay()]);
      const statsItems2: StatsItemsDisplay = StatsItemsDisplay.ofArray([]);

      expect(statsItems1.isEmpty()).toBe(false);
      expect(statsItems2.isEmpty()).toBe(true);
    });
  });

  describe('equals', () => {
    it('returns true if all the properties are the same', () => {
      const statsItemID1: MockStatsItemID = new MockStatsItemID();
      const statsItemID2: MockStatsItemID = new MockStatsItemID();
      const name1: string = 'stats item 1';
      const name2: string = 'stats item 2';
      const name3: string = 'stats item 3';
      const name4: string = 'stats item 4';
      const statsItems1: StatsItemsDisplay = StatsItemsDisplay.ofArray([
        new MockStatsItemDisplay({
          statsItemID: statsItemID1,
          name: new MockStatsItemName(name1)
        }),
        new MockStatsItemDisplay({
          statsItemID: statsItemID2,
          name: new MockStatsItemName(name2)
        })
      ]);
      const statsItems2: StatsItemsDisplay = StatsItemsDisplay.ofArray([
        new MockStatsItemDisplay({
          statsItemID: statsItemID1,
          name: new MockStatsItemName(name1)
        })
      ]);
      const statsItems3: StatsItemsDisplay = StatsItemsDisplay.ofArray([
        new MockStatsItemDisplay({
          statsItemID: statsItemID2,
          name: new MockStatsItemName(name2)
        })
      ]);
      const statsItems4: StatsItemsDisplay = StatsItemsDisplay.ofArray([
        new MockStatsItemDisplay({
          statsItemID: statsItemID2,
          name: new MockStatsItemName(name2)
        }),
        new MockStatsItemDisplay({
          statsItemID: statsItemID1,
          name: new MockStatsItemName(name1)
        })
      ]);
      const statsItems5: StatsItemsDisplay = StatsItemsDisplay.ofArray([
        new MockStatsItemDisplay({
          statsItemID: statsItemID1,
          name: new MockStatsItemName(name1)
        }),
        new MockStatsItemDisplay({
          statsItemID: statsItemID2,
          name: new MockStatsItemName(name2)
        })
      ]);
      const statsItems6: StatsItemsDisplay = StatsItemsDisplay.ofArray([
        new MockStatsItemDisplay({
          statsItemID: statsItemID1,
          name: new MockStatsItemName(name3)
        }),
        new MockStatsItemDisplay({
          statsItemID: statsItemID2,
          name: new MockStatsItemName(name2)
        })
      ]);
      const statsItems7: StatsItemsDisplay = StatsItemsDisplay.ofArray([
        new MockStatsItemDisplay({
          statsItemID: statsItemID1,
          name: new MockStatsItemName(name1)
        }),
        new MockStatsItemDisplay({
          statsItemID: statsItemID2,
          name: new MockStatsItemName(name4)
        })
      ]);
      const statsItems8: StatsItemsDisplay = StatsItemsDisplay.ofArray([
        new MockStatsItemDisplay({
          statsItemID: statsItemID1,
          name: new MockStatsItemName(name1),
          values: new MockStatsValues(
            new MockStatsValue({
              asOf: new MockAsOf({
                day: 2
              })
            })
          )
        }),
        new MockStatsItemDisplay({
          name: new MockStatsItemName(name2)
        })
      ]);
      const statsItems9: StatsItemsDisplay = StatsItemsDisplay.ofArray([
        new MockStatsItemDisplay({
          name: new MockStatsItemName(name1)
        }),
        new MockStatsItemDisplay({
          statsItemID: statsItemID2,
          name: new MockStatsItemName(name2),
          values: new MockStatsValues(
            new MockStatsValue({
              asOf: new MockAsOf({
                day: 2
              })
            })
          )
        })
      ]);
      const statsItems10: StatsItemsDisplay = StatsItemsDisplay.ofArray([
        new MockStatsItemDisplay({
          statsItemID: statsItemID1,
          name: new MockStatsItemName(name1),
          values: new MockStatsValues(
            new MockStatsValue({
              asOf: new MockAsOf({
                day: 2
              })
            })
          )
        }),
        new MockStatsItemDisplay({
          statsItemID: statsItemID2,
          name: new MockStatsItemName(name2),
          values: new MockStatsValues(
            new MockStatsValue({
              asOf: new MockAsOf({
                day: 2
              })
            })
          )
        })
      ]);

      expect(statsItems1.equals(statsItems1)).toBe(true);
      expect(statsItems1.equals(statsItems2)).toBe(false);
      expect(statsItems1.equals(statsItems3)).toBe(false);
      expect(statsItems1.equals(statsItems4)).toBe(false);
      expect(statsItems1.equals(statsItems5)).toBe(true);
      expect(statsItems1.equals(statsItems6)).toBe(false);
      expect(statsItems1.equals(statsItems7)).toBe(false);
      expect(statsItems1.equals(statsItems8)).toBe(false);
      expect(statsItems1.equals(statsItems9)).toBe(false);
      expect(statsItems1.equals(statsItems10)).toBe(false);
    });
  });

  describe('toString', () => {
    it('normal case', async () => {
      const id1: string = '8f7b1783-b09c-4010-aac1-dca1292ee700';
      const id2: string = '9e6b3c69-580c-4c19-9f3f-9bd82f582551';
      const name1: string = 'stats item 1';
      const name2: string = 'stats item 2';
      const statsItems: StatsItemsDisplay = StatsItemsDisplay.ofArray([
        StatsItemDisplay.of(await StatsItemID.ofString(id1).get(), StatsItemName.of(name1), StatsValues.empty()),
        StatsItemDisplay.of(await StatsItemID.ofString(id2).get(), StatsItemName.of(name2), StatsValues.empty())
      ]);

      expect(statsItems.toString()).toBe(`${id1} ${name1} , ${id2} ${name2} `);
    });
  });
});
