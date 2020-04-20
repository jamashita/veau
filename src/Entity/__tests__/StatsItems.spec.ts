import sinon, { SinonSpy } from 'sinon';
import { StatsItemError } from '../../Error/StatsItemError';
import { StatsItemsError } from '../../Error/StatsItemsError';
import { ImmutableSequence } from '../../General/Collection/Sequence/ImmutableSequence';
import { Absent } from '../../General/Quantum/Absent';
import { Failure } from '../../General/Superposition/Failure';
import { Success } from '../../General/Superposition/Success';
import { Superposition } from '../../General/Superposition/Superposition';
import { AsOfs } from '../../VO/AsOfs';
import { MockAsOf } from '../../VO/Mock/MockAsOf';
import { MockColumn } from '../../VO/Mock/MockColumn';
import { MockNumericalValue } from '../../VO/Mock/MockNumericalValue';
import { MockRow } from '../../VO/Mock/MockRow';
import { MockStatsItemID } from '../../VO/Mock/MockStatsItemID';
import { MockStatsItemName } from '../../VO/Mock/MockStatsItemName';
import { MockStatsValue } from '../../VO/Mock/MockStatsValue';
import { MockStatsValues } from '../../VO/Mock/MockStatsValues';
import { StatsItemID } from '../../VO/StatsItemID';
import { StatsItemName } from '../../VO/StatsItemName';
import { StatsItemNames } from '../../VO/StatsItemNames';
import { StatsValues } from '../../VO/StatsValues';
import { MockStatsItem } from '../Mock/MockStatsItem';
import { StatsItem, StatsItemJSON, StatsItemRow } from '../StatsItem';
import { StatsItems } from '../StatsItems';

describe('StatsItems', () => {
  describe('ofJSON', () => {
    it('normal case', () => {
      const json: Array<StatsItemJSON> = [
        {
          statsItemID: 'b1524ae3-8e91-4938-9997-579ef7b84602',
          name: 'stats name 1',
          values: []
        },
        {
          statsItemID: '1f0719d6-6512-43b3-93f9-2a92bcb51e32',
          name: 'stats name 2',
          values: []
        }
      ];

      const superposition: Superposition<StatsItems, StatsItemsError> = StatsItems.ofJSON(json);

      expect(superposition.isSuccess()).toBe(true);
      const items: StatsItems = superposition.get();
      expect(items.size()).toBe(2);
      for (let i: number = 0; i < items.size(); i++) {
        const item: StatsItem = items.get(i).get();
        expect(item.getStatsItemID().get().get()).toBe(json[i].statsItemID);
        expect(item.getName().get()).toBe(json[i].name);
      }
    });

    it('contains malformat statsItemID', () => {
      const json: Array<StatsItemJSON> = [
        {
          statsItemID: 'malformat uuid',
          name: 'stats name 1',
          values: []
        },
        {
          statsItemID: '1f0719d6-6512-43b3-93f9-2a92bcb51e32',
          name: 'stats name 2',
          values: []
        }
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<StatsItems, StatsItemsError> = StatsItems.ofJSON(json);

      expect(superposition.isFailure()).toBe(true);
      superposition.match<void>((items: StatsItems) => {
        spy1();
      }, (err: StatsItemsError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsItemsError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('contains malformat statsItemIDs', () => {
      const json: Array<StatsItemJSON> = [
        {
          statsItemID: 'malformat uuid 1',
          name: 'stats name 1',
          values: []
        },
        {
          statsItemID: 'malformat uuid 2',
          name: 'stats name 2',
          values: []
        }
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<StatsItems, StatsItemsError> = StatsItems.ofJSON(json);

      expect(superposition.isFailure()).toBe(true);
      superposition.match<void>((items: StatsItems) => {
        spy1();
      }, (err: StatsItemsError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsItemsError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('ofRow', () => {
    it('normal case', () => {
      const row: Array<StatsItemRow> = [
        {
          statsItemID: 'b1524ae3-8e91-4938-9997-579ef7b84602',
          name: 'stats name 1'
        },
        {
          statsItemID: '1f0719d6-6512-43b3-93f9-2a92bcb51e32',
          name: 'stats name 2'
        }
      ];

      const superposition: Superposition<StatsItems, StatsItemsError> = StatsItems.ofRow(
        row,
        StatsValues.empty()
      );

      expect(superposition.isSuccess()).toBe(true);
      const items: StatsItems = superposition.get();
      expect(items.size()).toBe(2);
      for (let i: number = 0; i < items.size(); i++) {
        const item: StatsItem = items.get(i).get();
        expect(item.getStatsItemID().get().get()).toBe(row[i].statsItemID);
        expect(item.getName().get()).toBe(row[i].name);
      }
    });

    it('contains malformat statsItemID', () => {
      const row: Array<StatsItemRow> = [
        {
          statsItemID: 'malformat uuid',
          name: 'stats name 1'
        },
        {
          statsItemID: '1f0719d6-6512-43b3-93f9-2a92bcb51e32',
          name: 'stats name 2'
        }
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<StatsItems, StatsItemsError> = StatsItems.ofRow(
        row,
        StatsValues.empty()
      );

      expect(superposition.isFailure()).toBe(true);
      superposition.match<void>((items: StatsItems) => {
        spy1();
      }, (err: StatsItemsError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsItemsError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('contains malformat statsItemIDs', () => {
      const row: Array<StatsItemRow> = [
        {
          statsItemID: 'malformat uuid 1',
          name: 'stats name 1'
        },
        {
          statsItemID: 'malformat uuid 2',
          name: 'stats name 2'
        }
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<StatsItems, StatsItemsError> = StatsItems.ofRow(
        row,
        StatsValues.empty()
      );

      expect(superposition.isFailure()).toBe(true);
      superposition.match<void>((items: StatsItems) => {
        spy1();
      }, (err: StatsItemsError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsItemsError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('isJSON', () => {
    it('normal case', () => {
      const n: unknown = [
        {
          statsItemID: 'ding dong 1',
          name: 'ting de dong 1',
          values: [
            {
              asOf: '2000-01-01',
              value: 1
            },
            {
              asOf: '2000-01-02',
              value: 2
            }
          ]
        },
        {
          statsItemID: 'ding dong 2',
          name: 'ting de dong 2',
          values: [
            {
              asOf: '2000-01-03',
              value: 3
            },
            {
              asOf: '2000-01-04',
              value: 4
            },
            {
              asOf: '2000-01-05',
              value: 5
            }
          ]
        }
      ];

      expect(StatsItems.isJSON(n)).toBe(true);
    });

    it('returns false because given parameter is not an object', () => {
      expect(StatsItems.isJSON(null)).toBe(false);
      expect(StatsItems.isJSON(undefined)).toBe(false);
      expect(StatsItems.isJSON(56)).toBe(false);
      expect(StatsItems.isJSON('fjafsd')).toBe(false);
      expect(StatsItems.isJSON(false)).toBe(false);
    });

    it('returns false because given parameter is not an array', () => {
      expect(StatsItems.isJSON({})).toBe(false);
    });

    it('returns false because the first element would not be StatsItemJSON', () => {
      const n: unknown = [
        {
          statsItemID: -0.2,
          name: 'ting de dong 1',
          values: [
            {
              asOf: '2000-01-01',
              value: 1
            },
            {
              asOf: '2000-01-02',
              value: 2
            }
          ]
        },
        {
          statsItemID: 'ding dong 2',
          name: 'ting de dong 2',
          values: [
            {
              asOf: '2000-01-03',
              value: 3
            },
            {
              asOf: '2000-01-04',
              value: 4
            },
            {
              asOf: '2000-01-05',
              value: 5
            }
          ]
        }
      ];

      expect(StatsItems.isJSON(n)).toBe(false);
    });

    it('returns false because the second element would not be StatsItemJSON', () => {
      const n: unknown = [
        {
          statsItemID: 'ding dong 1',
          name: 'ting de dong 1',
          values: [
            {
              asOf: '2000-01-01',
              value: 1
            },
            {
              asOf: '2000-01-02',
              value: 2
            }
          ]
        },
        {
          statsItemID: 'ding dong 2',
          name: false,
          values: [
            {
              asOf: '2000-01-03',
              value: 3
            },
            {
              asOf: '2000-01-04',
              value: 4
            },
            {
              asOf: '2000-01-05',
              value: 5
            }
          ]
        }
      ];

      expect(StatsItems.isJSON(n)).toBe(false);
    });
  });

  describe('ofArray', () => {
    it('normal case', () => {
      const items: Array<MockStatsItem> = [
        new MockStatsItem(),
        new MockStatsItem(),
        new MockStatsItem()
      ];

      const statsItems: StatsItems = StatsItems.ofArray(items);

      expect(statsItems.size()).toBe(items.length);
      for (let i: number = 0; i < statsItems.size(); i++) {
        expect(statsItems.get(i).get()).toBe(items[i]);
      }
    });
  });

  describe('ofSpread', () => {
    it('normal case', () => {
      const item1: MockStatsItem = new MockStatsItem();
      const item2: MockStatsItem = new MockStatsItem();
      const item3: MockStatsItem = new MockStatsItem();

      const statsItems: StatsItems = StatsItems.ofSpread(
        item1,
        item2,
        item3
      );

      expect(statsItems.size()).toBe(3);
      expect(statsItems.get(0).get()).toBe(item1);
      expect(statsItems.get(1).get()).toBe(item2);
      expect(statsItems.get(2).get()).toBe(item3);
    });
  });

  describe('ofSuperposition', () => {
    it('normal case', () => {
      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();

      const superposition1: Superposition<StatsItem, StatsItemError> = Success.of<StatsItem, StatsItemError>(statsItem1);
      const superposition2: Superposition<StatsItem, StatsItemError> = Success.of<StatsItem, StatsItemError>(statsItem2);
      const superposition: Superposition<StatsItems, StatsItemsError> = StatsItems.ofSuperposition([
        superposition1,
        superposition2
      ]);

      expect(superposition.isSuccess()).toBe(true);
      const items: StatsItems = superposition.get();
      expect(items.size()).toBe(2);
      expect(items.get(0).get()).toBe(statsItem1);
      expect(items.get(1).get()).toBe(statsItem2);
    });

    it('contains failure', () => {
      const statsItem1: MockStatsItem = new MockStatsItem();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition1: Superposition<StatsItem, StatsItemError> = Success.of<StatsItem, StatsItemError>(statsItem1);
      const superposition2: Superposition<StatsItem, StatsItemError> = Failure.of<StatsItem, StatsItemError>(
        new StatsItemError('test failed')
      );
      const superposition: Superposition<StatsItems, StatsItemsError> = StatsItems.ofSuperposition([
        superposition1,
        superposition2
      ]);

      expect(superposition.isFailure()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsItemsError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsItemsError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('will be multiple failures', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition1: Superposition<StatsItem, StatsItemError> = Failure.of<StatsItem, StatsItemError>(
        new StatsItemError('test failed1')
      );
      const superposition2: Superposition<StatsItem, StatsItemError> = Failure.of<StatsItem, StatsItemError>(
        new StatsItemError('test failed2')
      );
      const superposition: Superposition<StatsItems, StatsItemsError> = StatsItems.ofSuperposition([
        superposition1,
        superposition2
      ]);

      expect(superposition.isFailure()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsItemsError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsItemsError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('of', () => {
    it('returns StatsItem.empty() when the empty Sequence given', () => {
      expect(StatsItems.of(ImmutableSequence.empty<StatsItem>())).toBe(StatsItems.empty());
    });

    it('normal case', () => {
      const statsItems: StatsItems = StatsItems.of(
        ImmutableSequence.of<StatsItem>([
          new MockStatsItem(),
          new MockStatsItem()
        ])
      );

      expect(statsItems).not.toBe(StatsItems.empty());
    });
  });

  describe('empty', () => {
    it('gives 0-length StatsItems', () => {
      expect(StatsItems.empty().isEmpty()).toBe(true);
    });
  });

  describe('add', () => {
    it('does not affect the original one', () => {
      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItem3: MockStatsItem = new MockStatsItem();
      const statsItem4: MockStatsItem = new MockStatsItem();

      const statsItems1: StatsItems = StatsItems.ofArray([
        statsItem1,
        statsItem2
      ]);

      const statsItems2: StatsItems = statsItems1.add(
        statsItem3,
        statsItem4
      );

      expect(statsItems1.size()).toBe(2);
      expect(statsItems1.get(0).get()).toBe(statsItem1);
      expect(statsItems1.get(1).get()).toBe(statsItem2);

      expect(statsItems2.size()).toBe(4);
      expect(statsItems2.get(0).get()).toBe(statsItem1);
      expect(statsItems2.get(1).get()).toBe(statsItem2);
      expect(statsItems2.get(2).get()).toBe(statsItem3);
      expect(statsItems2.get(3).get()).toBe(statsItem4);
    });

    it('returns itself when the items are 0', () => {
      const statsItems: StatsItems = StatsItems.ofArray([
        new MockStatsItem(),
        new MockStatsItem()
      ]);

      expect(statsItems.add()).toBe(statsItems);
    });
  });

  describe('get', () => {
    it('returns Language instance at the correct index', () => {
      const items: Array<MockStatsItem> = [
        new MockStatsItem(),
        new MockStatsItem()
      ];

      const statsItems: StatsItems = StatsItems.ofArray(items);

      expect(statsItems.size()).toBe(items.length);
      for (let i: number = 0; i < statsItems.size(); i++) {
        expect(statsItems.get(i).get()).toBe(items[i]);
      }
    });

    it('returns Absent when the index is out of range', () => {
      const items: StatsItems = StatsItems.empty();

      expect(items.get(-1)).toBeInstanceOf(Absent);
      expect(items.get(0)).toBeInstanceOf(Absent);
    });
  });

  describe('move', () => {
    it('first index', () => {
      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItem3: MockStatsItem = new MockStatsItem();
      const statsItems: StatsItems = StatsItems.ofArray([
        statsItem1,
        statsItem2,
        statsItem3
      ]);

      const moved: StatsItems = statsItems.move(
        new MockColumn(0),
        new MockColumn(1)
      );

      expect(moved.size()).toBe(3);
      expect(moved.get(0).get()).toBe(statsItem2);
      expect(moved.get(1).get()).toBe(statsItem1);
      expect(moved.get(2).get()).toBe(statsItem3);
    });

    it('middle index', () => {
      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItem3: MockStatsItem = new MockStatsItem();
      const statsItems: StatsItems = StatsItems.ofArray([
        statsItem1,
        statsItem2,
        statsItem3
      ]);

      const moved: StatsItems = statsItems.move(
        new MockColumn(1),
        new MockColumn(2)
      );

      expect(moved.size()).toBe(3);
      expect(moved.get(0).get()).toBe(statsItem1);
      expect(moved.get(1).get()).toBe(statsItem3);
      expect(moved.get(2).get()).toBe(statsItem2);
    });

    it('last index', () => {
      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItem3: MockStatsItem = new MockStatsItem();
      const statsItems: StatsItems = StatsItems.ofArray([
        statsItem1,
        statsItem2,
        statsItem3
      ]);

      const moved: StatsItems = statsItems.move(
        new MockColumn(2),
        new MockColumn(0)
      );

      expect(moved.size()).toBe(3);
      expect(moved.get(0).get()).toBe(statsItem3);
      expect(moved.get(1).get()).toBe(statsItem2);
      expect(moved.get(2).get()).toBe(statsItem1);
    });
  });

  describe('replace', () => {
    it('first index', () => {
      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItem3: MockStatsItem = new MockStatsItem();
      const statsItem4: MockStatsItem = new MockStatsItem();
      const statsItems: StatsItems = StatsItems.ofArray([
        statsItem1,
        statsItem2,
        statsItem3
      ]);

      const replaced: StatsItems = statsItems.replace(
        statsItem4,
        new MockRow(0)
      );

      expect(replaced.size()).toBe(3);
      expect(replaced.get(0).get()).toBe(statsItem4);
      expect(replaced.get(1).get()).not.toBe(statsItem4);
      expect(replaced.get(2).get()).not.toBe(statsItem4);
    });

    it('middle index', () => {
      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItem3: MockStatsItem = new MockStatsItem();
      const statsItem4: MockStatsItem = new MockStatsItem();
      const statsItems: StatsItems = StatsItems.ofArray([
        statsItem1,
        statsItem2,
        statsItem3
      ]);

      const replaced: StatsItems = statsItems.replace(
        statsItem4,
        new MockRow(1)
      );

      expect(replaced.size()).toBe(3);
      expect(replaced.get(0).get()).not.toBe(statsItem4);
      expect(replaced.get(1).get()).toBe(statsItem4);
      expect(replaced.get(2).get()).not.toBe(statsItem4);
    });

    it('last index', () => {
      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItem3: MockStatsItem = new MockStatsItem();
      const statsItem4: MockStatsItem = new MockStatsItem();
      const statsItems: StatsItems = StatsItems.ofArray([
        statsItem1,
        statsItem2,
        statsItem3
      ]);

      const replaced: StatsItems = statsItems.replace(
        statsItem4,
        new MockRow(2)
      );

      expect(replaced.size()).toBe(3);
      expect(replaced.get(0).get()).not.toBe(statsItem4);
      expect(replaced.get(1).get()).not.toBe(statsItem4);
      expect(replaced.get(2).get()).toBe(statsItem4);
    });
  });

  describe('remove', () => {
    it('correctly removed the same object', () => {
      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItem3: MockStatsItem = new MockStatsItem();
      const statsItems: StatsItems = StatsItems.ofArray([
        statsItem1,
        statsItem2,
        statsItem3
      ]);

      const removed: StatsItems = statsItems.remove(statsItem1);

      expect(removed.size()).toBe(2);
      expect(removed.get(0).get()).toBe(statsItem2);
      expect(removed.get(1).get()).toBe(statsItem3);
    });

    it('returns StatsItems.empty() when all the items are removed', () => {
      const statsItem: MockStatsItem = new MockStatsItem();
      const statsItems: StatsItems = StatsItems.ofArray([
        statsItem
      ]);

      const removed: StatsItems = statsItems.remove(statsItem);

      expect(removed.size()).toBe(0);
      expect(removed).toBe(StatsItems.empty());
    });
  });

  describe('maxNameLength', () => {
    it('normal case', () => {
      const name1: MockStatsItemName = new MockStatsItemName('stats name 1');
      const name2: MockStatsItemName = new MockStatsItemName('stats name 11');
      const name3: MockStatsItemName = new MockStatsItemName('stats name 111');

      const statsItems: StatsItems = StatsItems.ofArray([
        new MockStatsItem({
          name: name1
        }),
        new MockStatsItem({
          name: name2
        }),
        new MockStatsItem({
          name: name3
        })
      ]);

      expect(statsItems.maxNameLength()).toBe(name3.length());
    });

    it('should give 0 when items are 0', () => {
      const statsItems: StatsItems = StatsItems.ofArray([]);

      expect(statsItems.maxNameLength()).toBe(0);
    });
  });

  describe('getAsOfs', () => {
    it('collects all AsOfs even if the date is same', () => {
      const statsItem1: MockStatsItem = new MockStatsItem({
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
      const statsItem2: MockStatsItem = new MockStatsItem({
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
      const statsItem3: MockStatsItem = new MockStatsItem({
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
      const statsItems: StatsItems = StatsItems.ofArray([
        statsItem1,
        statsItem2,
        statsItem3
      ]);

      const asOfs: AsOfs = statsItems.getAsOfs();
      expect(asOfs.size()).toBe(8);
      expect(asOfs.get(0).get().toString()).toBe('2000-01-01');
      expect(asOfs.get(1).get().toString()).toBe('2000-01-02');
      expect(asOfs.get(2).get().toString()).toBe('2000-01-03');
      expect(asOfs.get(3).get().toString()).toBe('2000-01-02');
      expect(asOfs.get(4).get().toString()).toBe('2000-01-03');
      expect(asOfs.get(5).get().toString()).toBe('2000-01-04');
      expect(asOfs.get(6).get().toString()).toBe('2000-01-04');
      expect(asOfs.get(7).get().toString()).toBe('2000-01-05');
    });
  });

  describe('getNames', () => {
    it('normal case', () => {
      const name1: MockStatsItemName = new MockStatsItemName('stats name 1');
      const name2: MockStatsItemName = new MockStatsItemName('stats name 11');
      const name3: MockStatsItemName = new MockStatsItemName('stats name 111');

      const statsItems: StatsItems = StatsItems.ofArray([
        new MockStatsItem({
          name: name1
        }),
        new MockStatsItem({
          name: name2
        }),
        new MockStatsItem({
          name: name3
        })
      ]);

      const names: StatsItemNames = statsItems.getNames();

      expect(names.size()).toBe(3);
      expect(names.get(0).get()).toBe(name1);
      expect(names.get(1).get()).toBe(name2);
      expect(names.get(2).get()).toBe(name3);
    });
  });

  describe('areFilled', () => {
    it('returns true if the all items are filled', () => {
      const statsItems1: StatsItems = StatsItems.ofArray([
        new MockStatsItem({
          name: new MockStatsItemName('stats item 1')
        }),
        new MockStatsItem({
          name: new MockStatsItemName('stats item 2')
        })
      ]);
      const statsItems2: StatsItems = StatsItems.ofArray([
        new MockStatsItem({
          name: new MockStatsItemName('stats item 3')
        }),
        StatsItem.default()
      ]);

      expect(statsItems1.areFilled()).toBe(true);
      expect(statsItems2.areFilled()).toBe(false);
    });
  });

  describe('areValid', () => {
    it('returns true if the all items are valid', () => {
      const statsItems1: StatsItems = StatsItems.ofArray([
        new MockStatsItem({
          name: new MockStatsItemName('stats item 1')
        }),
        new MockStatsItem({
          name: new MockStatsItemName('stats item 2')
        })
      ]);
      const statsItems2: StatsItems = StatsItems.ofArray([
        new MockStatsItem({
          name: new MockStatsItemName('stats item 3')
        }),
        StatsItem.default()
      ]);

      expect(statsItems1.areValid()).toBe(true);
      expect(statsItems2.areValid()).toBe(false);
    });
  });

  describe('haveValues', () => {
    it('no items', () => {
      const statsItems: StatsItems = StatsItems.ofArray([]);

      expect(statsItems.haveValues()).toBe(false);
    });

    it('no values', () => {
      const statsItems1: StatsItems = StatsItems.ofArray([
        new MockStatsItem({
          values: new MockStatsValues()
        })
      ]);
      const statsItems2: StatsItems = StatsItems.ofArray([
        new MockStatsItem(),
        new MockStatsItem()
      ]);

      expect(statsItems1.haveValues()).toBe(false);
      expect(statsItems2.haveValues()).toBe(false);
    });

    it('have values', () => {
      const statsItems: StatsItems = StatsItems.ofArray([
        new MockStatsItem({
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
      const statsItem1: MockStatsItem = new MockStatsItem({
        statsItemID: statsItemID1
      });
      const statsItem2: MockStatsItem = new MockStatsItem({
        statsItemID: statsItemID2
      });
      const statsItem3: MockStatsItem = new MockStatsItem({
        statsItemID: statsItemID3
      });
      const statsItem4: MockStatsItem = new MockStatsItem({
        statsItemID: statsItemID1
      });
      const statsItems: StatsItems = StatsItems.ofArray([
        statsItem1,
        statsItem2
      ]);

      expect(statsItems.contains(statsItem1)).toBe(true);
      expect(statsItems.contains(statsItem2)).toBe(true);
      expect(statsItems.contains(statsItem3)).toBe(false);
      expect(statsItems.contains(statsItem4)).toBe(true);
    });
  });

  describe('duplicate', () => {
    it('shallow duplicated', () => {
      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItem3: MockStatsItem = new MockStatsItem();
      const statsItems: StatsItems = StatsItems.ofArray([
        statsItem1,
        statsItem2,
        statsItem3
      ]);

      const duplicated: StatsItems = statsItems.duplicate();

      expect(statsItems).not.toBe(duplicated);
      expect(duplicated.get(0).get()).toBe(statsItem1);
      expect(duplicated.get(1).get()).toBe(statsItem2);
      expect(duplicated.get(2).get()).toBe(statsItem3);
    });

    it('returns StatsItems.empty when it is already empty', () => {
      expect(StatsItems.empty().duplicate()).toBe(StatsItems.empty());
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements are 0', () => {
      const statsItems1: StatsItems = StatsItems.ofArray([
        new MockStatsItem(),
        new MockStatsItem()
      ]);
      const statsItems2: StatsItems = StatsItems.ofArray([]);

      expect(statsItems1.isEmpty()).toBe(false);
      expect(statsItems2.isEmpty()).toBe(true);
    });
  });

  describe('equals', () => {
    it('returns false if the length is different', () => {
      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItems1: StatsItems = StatsItems.ofArray([
        statsItem1,
        statsItem2
      ]);
      const statsItems2: StatsItems = StatsItems.ofArray([
        statsItem2
      ]);

      expect(statsItems1.equals(statsItems1)).toBe(true);
      expect(statsItems1.equals(statsItems2)).toBe(false);
    });

    it('returns false if the sequence is different', () => {
      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItems1: StatsItems = StatsItems.ofArray([
        statsItem1,
        statsItem2
      ]);
      const statsItems2: StatsItems = StatsItems.ofArray([
        statsItem2,
        statsItem1
      ]);

      expect(statsItems1.equals(statsItems1)).toBe(true);
      expect(statsItems1.equals(statsItems2)).toBe(false);
    });

    it('returns true if the elements and their order are same', () => {
      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItems1: StatsItems = StatsItems.ofArray([
        statsItem1,
        statsItem2
      ]);
      const statsItems2: StatsItems = StatsItems.ofArray([
        statsItem1,
        statsItem2
      ]);

      expect(statsItems1.equals(statsItems1)).toBe(true);
      expect(statsItems1.equals(statsItems2)).toBe(true);
    });
  });

  describe('areSame', () => {
    it('returns true if all the properties are the same', () => {
      const statsItemID1: MockStatsItemID = new MockStatsItemID();
      const statsItemID2: MockStatsItemID = new MockStatsItemID();
      const name1: string = 'stats item 1';
      const name2: string = 'stats item 2';
      const name3: string = 'stats item 3';
      const name4: string = 'stats item 4';
      const statsItems1: StatsItems = StatsItems.ofArray([
        new MockStatsItem({
          statsItemID: statsItemID1,
          name: new MockStatsItemName(name1)
        }),
        new MockStatsItem({
          statsItemID: statsItemID2,
          name: new MockStatsItemName(name2)
        })
      ]);
      const statsItems2: StatsItems = StatsItems.ofArray([
        new MockStatsItem({
          statsItemID: statsItemID1,
          name: new MockStatsItemName(name1)
        })
      ]);
      const statsItems3: StatsItems = StatsItems.ofArray([
        new MockStatsItem({
          statsItemID: statsItemID2,
          name: new MockStatsItemName(name2)
        })
      ]);
      const statsItems4: StatsItems = StatsItems.ofArray([
        new MockStatsItem({
          statsItemID: statsItemID2,
          name: new MockStatsItemName(name2)
        }),
        new MockStatsItem({
          statsItemID: statsItemID1,
          name: new MockStatsItemName(name1)
        })
      ]);
      const statsItems5: StatsItems = StatsItems.ofArray([
        new MockStatsItem({
          statsItemID: statsItemID1,
          name: new MockStatsItemName(name1)
        }),
        new MockStatsItem({
          statsItemID: statsItemID2,
          name: new MockStatsItemName(name2)
        })
      ]);
      const statsItems6: StatsItems = StatsItems.ofArray([
        new MockStatsItem({
          statsItemID: statsItemID1,
          name: new MockStatsItemName(name3)
        }),
        new MockStatsItem({
          statsItemID: statsItemID2,
          name: new MockStatsItemName(name2)
        })
      ]);
      const statsItems7: StatsItems = StatsItems.ofArray([
        new MockStatsItem({
          statsItemID: statsItemID1,
          name: new MockStatsItemName(name1)
        }),
        new MockStatsItem({
          statsItemID: statsItemID2,
          name: new MockStatsItemName(name4)
        })
      ]);
      const statsItems8: StatsItems = StatsItems.ofArray([
        new MockStatsItem({
          statsItemID: statsItemID1,
          name: new MockStatsItemName(name1),
          values: new MockStatsValues(
            new MockStatsValue({
              statsItemID: statsItemID1
            })
          )
        }),
        new MockStatsItem({
          statsItemID: statsItemID2,
          name: new MockStatsItemName(name2)
        })
      ]);
      const statsItems9: StatsItems = StatsItems.ofArray([
        new MockStatsItem({
          statsItemID: statsItemID1,
          name: new MockStatsItemName(name1)
        }),
        new MockStatsItem({
          statsItemID: statsItemID2,
          name: new MockStatsItemName(name2),
          values: new MockStatsValues(
            new MockStatsValue({
              statsItemID: statsItemID2
            })
          )
        })
      ]);
      const statsItems10: StatsItems = StatsItems.ofArray([
        new MockStatsItem({
          statsItemID: statsItemID1,
          name: new MockStatsItemName(name1),
          values: new MockStatsValues(
            new MockStatsValue({
              statsItemID: statsItemID1
            })
          )
        }),
        new MockStatsItem({
          statsItemID: statsItemID2,
          name: new MockStatsItemName(name2),
          values: new MockStatsValues(
            new MockStatsValue({
              statsItemID: statsItemID2
            })
          )
        })
      ]);

      expect(statsItems1.areSame(statsItems1)).toBe(true);
      expect(statsItems1.areSame(statsItems2)).toBe(false);
      expect(statsItems1.areSame(statsItems3)).toBe(false);
      expect(statsItems1.areSame(statsItems4)).toBe(false);
      expect(statsItems1.areSame(statsItems5)).toBe(true);
      expect(statsItems1.areSame(statsItems6)).toBe(false);
      expect(statsItems1.areSame(statsItems7)).toBe(false);
      expect(statsItems1.areSame(statsItems8)).toBe(false);
      expect(statsItems1.areSame(statsItems9)).toBe(false);
      expect(statsItems1.areSame(statsItems10)).toBe(false);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const statsItems: StatsItems = StatsItems.ofArray([
        StatsItem.of(
          StatsItemID.ofString('8f7b1783-b09c-4010-aac1-dca1292ee700').get(),
          StatsItemName.of('stats item 1'),
          StatsValues.empty()
        ),
        StatsItem.of(
          StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(),
          StatsItemName.of('stats item 2'),
          StatsValues.empty()
        )
      ]);

      expect(statsItems.toJSON()).toEqual([
        {
          statsItemID: '8f7b1783-b09c-4010-aac1-dca1292ee700',
          name: 'stats item 1',
          values: []
        },
        {
          statsItemID: '9e6b3c69-580c-4c19-9f3f-9bd82f582551',
          name: 'stats item 2',
          values: []
        }
      ]);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const id1: string = '8f7b1783-b09c-4010-aac1-dca1292ee700';
      const id2: string = '9e6b3c69-580c-4c19-9f3f-9bd82f582551';
      const name1: string = 'stats item 1';
      const name2: string = 'stats item 2';
      const statsItems: StatsItems = StatsItems.ofArray([
        StatsItem.of(
          StatsItemID.ofString(id1).get(),
          StatsItemName.of(name1),
          StatsValues.empty()
        ),
        StatsItem.of(
          StatsItemID.ofString(id2).get(),
          StatsItemName.of(name2),
          StatsValues.empty()
        )
      ]);

      expect(statsItems.toString()).toBe(`${id1} ${name1} , ${id2} ${name2} `);
    });
  });
});
