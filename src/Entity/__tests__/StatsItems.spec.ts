import sinon, { SinonSpy } from 'sinon';
import { StatsItemError } from '../../Error/StatsItemError';
import { StatsItemsError } from '../../Error/StatsItemsError';
import { None } from '../../General/Optional/None';
import { Failure } from '../../General/Try/Failure';
import { Success } from '../../General/Try/Success';
import { Try } from '../../General/Try/Try';
import { AsOfs } from '../../VO/AsOfs';
import { StatsItemID } from '../../VO/StatsItemID';
import { StatsItemName } from '../../VO/StatsItemName';
import { StatsItemNames } from '../../VO/StatsItemNames';
import { StatsValues } from '../../VO/StatsValues';
import { StatsItem, StatsItemJSON, StatsItemRow } from '../StatsItem';
import { StatsItems } from '../StatsItems';
import { MockStatsItem } from '../Mock/MockStatsItem';
import { MockColumn } from '../../VO/Mock/MockColumn';
import { MockRow } from '../../VO/Mock/MockRow';
import { MockStatsItemName } from '../../VO/Mock/MockStatsItemName';
import { MockStatsValues } from '../../VO/Mock/MockStatsValues';
import { MockStatsValue } from '../../VO/Mock/MockStatsValue';
import { MockAsOf } from '../../VO/Mock/MockAsOf';
import { MockNumericalValue } from '../../VO/Mock/MockNumericalValue';
import { MockStatsItemID } from '../../VO/Mock/MockStatsItemID';

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

      const trial: Try<StatsItems, StatsItemsError> = StatsItems.ofJSON(json);

      expect(trial.isSuccess()).toEqual(true);
      const items: StatsItems = trial.get();
      expect(items.size()).toEqual(2);
      for (let i: number = 0; i < items.size(); i++) {
        const item: StatsItem = items.get(i).get();
        expect(item.getStatsItemID().get().get()).toEqual(json[i].statsItemID);
        expect(item.getName().get()).toEqual(json[i].name);
      }
    });

    it('contains malformat statsItemID', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

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

      const trial: Try<StatsItems, StatsItemsError> = StatsItems.ofJSON(json);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>((items: StatsItems) => {
        spy1();
      }, (err: StatsItemsError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsItemsError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('contains malformat statsItemIDs', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

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

      const trial: Try<StatsItems, StatsItemsError> = StatsItems.ofJSON(json);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>((items: StatsItems) => {
        spy1();
      }, (err: StatsItemsError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsItemsError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
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

      const trial: Try<StatsItems, StatsItemsError> = StatsItems.ofRow(row, StatsValues.empty());

      expect(trial.isSuccess()).toEqual(true);
      const items: StatsItems = trial.get();
      expect(items.size()).toEqual(2);
      for (let i: number = 0; i < items.size(); i++) {
        const item: StatsItem = items.get(i).get();
        expect(item.getStatsItemID().get().get()).toEqual(row[i].statsItemID);
        expect(item.getName().get()).toEqual(row[i].name);
      }
    });

    it('contains malformat statsItemID', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

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

      const trial: Try<StatsItems, StatsItemsError> = StatsItems.ofRow(row, StatsValues.empty());

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>((items: StatsItems) => {
        spy1();
      }, (err: StatsItemsError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsItemsError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('contains malformat statsItemIDs', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

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

      const trial: Try<StatsItems, StatsItemsError> = StatsItems.ofRow(row, StatsValues.empty());

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>((items: StatsItems) => {
        spy1();
      }, (err: StatsItemsError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsItemsError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
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

      expect(StatsItems.isJSON(n)).toEqual(true);
    });

    it('returns false because given parameter is not an object', () => {
      expect(StatsItems.isJSON(null)).toEqual(false);
      expect(StatsItems.isJSON(undefined)).toEqual(false);
      expect(StatsItems.isJSON(56)).toEqual(false);
      expect(StatsItems.isJSON('fjafsd')).toEqual(false);
      expect(StatsItems.isJSON(false)).toEqual(false);
    });

    it('returns false because given parameter is not an array', () => {
      expect(StatsItems.isJSON({})).toEqual(false);
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

      expect(StatsItems.isJSON(n)).toEqual(false);
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

      expect(StatsItems.isJSON(n)).toEqual(false);
    });
  });

  describe('ofArray', () => {
    it('normal case', () => {
      const item1: MockStatsItem = new MockStatsItem();
      const item2: MockStatsItem = new MockStatsItem();
      const item3: MockStatsItem = new MockStatsItem();
      const items: Array<MockStatsItem> = [
        item1,
        item2,
        item3
      ];

      const statsItems: StatsItems = StatsItems.ofArray(items);

      expect(statsItems.size()).toEqual(items.length);
      for (let i: number = 0; i < statsItems.size(); i++) {
        expect(statsItems.get(i).get()).toEqual(items[i]);
      }
    });
  });

  describe('ofSpread', () => {
    it('normal case', () => {
      const item1: MockStatsItem = new MockStatsItem();
      const item2: MockStatsItem = new MockStatsItem();
      const item3: MockStatsItem = new MockStatsItem();
      const items: Array<MockStatsItem> = [
        item1,
        item2,
        item3
      ];

      const statsItems: StatsItems = StatsItems.ofSpread(
        item1,
        item2,
        item3
      );

      expect(statsItems.size()).toEqual(items.length);
      for (let i: number = 0; i < statsItems.size(); i++) {
        expect(statsItems.get(i).get()).toEqual(items[i]);
      }
    });
  });

  describe('ofTry', () => {
    it('normal case', () => {
      const statsItem1: MockStatsItem = new MockStatsItem()
      const statsItem2: MockStatsItem = new MockStatsItem()

      const trial1: Try<StatsItem, StatsItemError> = Success.of<StatsItem, StatsItemError>(statsItem1);
      const trial2: Try<StatsItem, StatsItemError> = Success.of<StatsItem, StatsItemError>(statsItem2);
      const trial: Try<StatsItems, StatsItemsError> = StatsItems.ofTry([
        trial1,
        trial2
      ]);

      expect(trial.isSuccess()).toEqual(true);
      const items: StatsItems = trial.get();
      expect(items.size()).toEqual(2);
      expect(items.get(0).get()).toEqual(statsItem1);
      expect(items.get(1).get()).toEqual(statsItem2);
    });

    it('contains failure', () => {
      const statsItem1: MockStatsItem = new MockStatsItem()

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const trial1: Try<StatsItem, StatsItemError> = Success.of<StatsItem, StatsItemError>(statsItem1);
      const trial2: Try<StatsItem, StatsItemError> = Failure.of<StatsItem, StatsItemError>(new StatsItemError('test failed'));
      const trial: Try<StatsItems, StatsItemsError> = StatsItems.ofTry([
        trial1,
        trial2
      ]);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsItemsError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsItemsError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('will be multiple failures', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const trial1: Try<StatsItem, StatsItemError> = Failure.of<StatsItem, StatsItemError>(new StatsItemError('test failed1'));
      const trial2: Try<StatsItem, StatsItemError> = Failure.of<StatsItem, StatsItemError>(new StatsItemError('test failed2'));
      const trial: Try<StatsItems, StatsItemsError> = StatsItems.ofTry([
        trial1,
        trial2
      ]);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsItemsError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsItemsError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('empty', () => {
    it('gives 0-length StatsItems', () => {
      expect(StatsItems.empty().isEmpty()).toEqual(true);
    });
  });

  describe('add', () => {
    it('does not affect the original one', () => {
      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItem3: MockStatsItem = new MockStatsItem();
      const statsItem4: MockStatsItem = new MockStatsItem();

      const statsItems1: StatsItems = StatsItems.ofSpread(
        statsItem1,
        statsItem2
      );

      const statsItems2: StatsItems = statsItems1.add(
        statsItem3,
        statsItem4
      );

      expect(statsItems1.size()).toEqual(2);
      expect(statsItems1.get(0).get()).toEqual(statsItem1);
      expect(statsItems1.get(1).get()).toEqual(statsItem2);

      expect(statsItems2.size()).toEqual(4);
      expect(statsItems2.get(0).get()).toEqual(statsItem1);
      expect(statsItems2.get(1).get()).toEqual(statsItem2);
      expect(statsItems2.get(2).get()).toEqual(statsItem3);
      expect(statsItems2.get(3).get()).toEqual(statsItem4);
    });
  });

  describe('get', () => {
    it('returns Language instance at the correct index', () => {
      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItems: StatsItems = StatsItems.ofSpread(
        statsItem1,
        statsItem2
      );

      expect(statsItems.size()).toEqual(2);
      expect(statsItems.get(0).get()).toEqual(statsItem1);
      expect(statsItems.get(1).get()).toEqual(statsItem2);
    });

    it('returns None when the index is out of range', () => {
      const items: StatsItems = StatsItems.empty();

      expect(items.get(-1)).toBeInstanceOf(None);
      expect(items.get(0)).toBeInstanceOf(None);
    });
  });

  describe('move', () => {
    it('first index', () => {
      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItem3: MockStatsItem = new MockStatsItem();
      const statsItems: StatsItems = StatsItems.ofSpread(
        statsItem1,
        statsItem2,
        statsItem3
      );

      const moved: StatsItems = statsItems.move(
        new MockColumn(0),
        new MockColumn(1)
      );

      expect(moved.size()).toEqual(3);
      expect(moved.get(0).get()).toEqual(statsItem2);
      expect(moved.get(1).get()).toEqual(statsItem1);
      expect(moved.get(2).get()).toEqual(statsItem3);
    });

    it('middle index', () => {
      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItem3: MockStatsItem = new MockStatsItem();
      const statsItems: StatsItems = StatsItems.ofSpread(
        statsItem1,
        statsItem2,
        statsItem3
      );

      const moved: StatsItems = statsItems.move(
        new MockColumn(1),
        new MockColumn(2)
      );

      expect(moved.size()).toEqual(3);
      expect(moved.get(0).get()).toEqual(statsItem1);
      expect(moved.get(1).get()).toEqual(statsItem3);
      expect(moved.get(2).get()).toEqual(statsItem2);
    });

    it('last index', () => {
      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItem3: MockStatsItem = new MockStatsItem();
      const statsItems: StatsItems = StatsItems.ofSpread(
        statsItem1,
        statsItem2,
        statsItem3
      );

      const moved: StatsItems = statsItems.move(
        new MockColumn(2),
        new MockColumn(0)
      );

      expect(moved.size()).toEqual(3);
      expect(moved.get(0).get()).toEqual(statsItem3);
      expect(moved.get(1).get()).toEqual(statsItem2);
      expect(moved.get(2).get()).toEqual(statsItem1);
    });
  });

  describe('replace', () => {
    it('first index', () => {
      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItem3: MockStatsItem = new MockStatsItem();
      const statsItem4: MockStatsItem = new MockStatsItem();
      const statsItems: StatsItems = StatsItems.ofSpread(
        statsItem1,
        statsItem2,
        statsItem3
      );

      const replaced: StatsItems = statsItems.replace(
        statsItem4,
        new MockRow(0)
      );

      expect(replaced.size()).toEqual(3);
      expect(replaced.get(0).get()).toEqual(statsItem4);
      expect(replaced.get(1).get()).not.toEqual(statsItem4);
      expect(replaced.get(2).get()).not.toEqual(statsItem4);
    });

    it('middle index', () => {
      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItem3: MockStatsItem = new MockStatsItem();
      const statsItem4: MockStatsItem = new MockStatsItem();
      const statsItems: StatsItems = StatsItems.ofSpread(
        statsItem1,
        statsItem2,
        statsItem3
      );

      const replaced: StatsItems = statsItems.replace(
        statsItem4,
        new MockRow(1)
      );

      expect(replaced.size()).toEqual(3);
      expect(replaced.get(0).get()).not.toEqual(statsItem4);
      expect(replaced.get(1).get()).toEqual(statsItem4);
      expect(replaced.get(2).get()).not.toEqual(statsItem4);
    });

    it('last index', () => {
      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItem3: MockStatsItem = new MockStatsItem();
      const statsItem4: MockStatsItem = new MockStatsItem();
      const statsItems: StatsItems = StatsItems.ofSpread(
        statsItem1,
        statsItem2,
        statsItem3
      );

      const replaced: StatsItems = statsItems.replace(
        statsItem4,
        new MockRow(2)
      );

      expect(replaced.size()).toEqual(3);
      expect(replaced.get(0).get()).not.toEqual(statsItem4);
      expect(replaced.get(1).get()).not.toEqual(statsItem4);
      expect(replaced.get(2).get()).toEqual(statsItem4);
    });
  });

  describe('removeItem', () => {
    it('correctly removed the same object', () => {
      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItem3: MockStatsItem = new MockStatsItem();
      const statsItems: StatsItems = StatsItems.ofSpread(
        statsItem1,
        statsItem2,
        statsItem3
      );

      const removed: StatsItems = statsItems.remove(statsItem1);

      expect(removed.size()).toEqual(2);
      expect(removed.get(0).get()).toEqual(statsItem2);
      expect(removed.get(1).get()).toEqual(statsItem3);
    });
  });

  describe('maxNameLength', () => {
    it('normal case', () => {
      const name1: string = 'stats name 1';
      const name2: string = 'stats name 11';
      const name3: string = 'stats name 111';
      const statsItem1: MockStatsItem = new MockStatsItem({
        name: new MockStatsItemName(name1)
      });
      const statsItem2: MockStatsItem = new MockStatsItem({
        name: new MockStatsItemName(name2)
      });
      const statsItem3: MockStatsItem = new MockStatsItem({
        name: new MockStatsItemName(name3)
      });
      const statsItems: StatsItems = StatsItems.ofSpread(
        statsItem1,
        statsItem2,
        statsItem3
      );

      expect(statsItems.maxNameLength()).toEqual(name3.length);
    });

    it('should give 0 when items are 0', () => {
      const statsItems: StatsItems = StatsItems.ofSpread();

      expect(statsItems.maxNameLength()).toEqual(0);
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
      const statsItems: StatsItems = StatsItems.ofSpread(
        statsItem1,
        statsItem2,
        statsItem3
      );

      const asOfs: AsOfs = statsItems.getAsOfs();
      expect(asOfs.size()).toEqual(8);
      expect(asOfs.get(0).get().toString()).toEqual('2000-01-01');
      expect(asOfs.get(1).get().toString()).toEqual('2000-01-02');
      expect(asOfs.get(2).get().toString()).toEqual('2000-01-03');
      expect(asOfs.get(3).get().toString()).toEqual('2000-01-02');
      expect(asOfs.get(4).get().toString()).toEqual('2000-01-03');
      expect(asOfs.get(5).get().toString()).toEqual('2000-01-04');
      expect(asOfs.get(6).get().toString()).toEqual('2000-01-04');
      expect(asOfs.get(7).get().toString()).toEqual('2000-01-05');
    });
  });

  describe('getNames', () => {
    it('normal case', () => {
      const name1: string = 'stats name 1';
      const name2: string = 'stats name 11';
      const name3: string = 'stats name 111';
      const statsItem1: MockStatsItem = new MockStatsItem({
        name: new MockStatsItemName(name1)
      });
      const statsItem2: MockStatsItem = new MockStatsItem({
        name: new MockStatsItemName(name2)
      });
      const statsItem3: MockStatsItem = new MockStatsItem({
        name: new MockStatsItemName(name3)
      });
      const statsItems: StatsItems = StatsItems.ofSpread(
        statsItem1,
        statsItem2,
        statsItem3
      );

      const names: StatsItemNames = statsItems.getNames();

      expect(names.size()).toEqual(3);
      expect(names.get(0).get().get()).toEqual(name1);
      expect(names.get(1).get().get()).toEqual(name2);
      expect(names.get(2).get().get()).toEqual(name3);
    });
  });

  describe('areFilled', () => {
    it('returns true if the all items are filled', () => {
      const statsItem1: MockStatsItem = new MockStatsItem({
        name: new MockStatsItemName('stats item 1')
      });
      const statsItem2: MockStatsItem = new MockStatsItem({
        name: new MockStatsItemName('stats item 2')
      });
      const statsItem3: MockStatsItem = new MockStatsItem({
        name: new MockStatsItemName('')
      });
      const statsItems1: StatsItems = StatsItems.ofSpread(
        statsItem1,
        statsItem2
      );
      const statsItems2: StatsItems = StatsItems.ofSpread(
        statsItem2,
        statsItem3
      );

      expect(statsItems1.areFilled()).toEqual(true);
      expect(statsItems2.areFilled()).toEqual(false);
    });
  });

  describe('areValid', () => {
    it('returns true if the all items are valid', () => {
      const statsItem1: MockStatsItem = new MockStatsItem({
        name: new MockStatsItemName('stats item 1')
      });
      const statsItem2: MockStatsItem = new MockStatsItem({
        name: new MockStatsItemName('stats item 2')
      });
      const statsItem3: MockStatsItem = new MockStatsItem({
        name: new MockStatsItemName('')
      });
      const statsItems1: StatsItems = StatsItems.ofSpread(
        statsItem1,
        statsItem2
      );
      const statsItems2: StatsItems = StatsItems.ofSpread(
        statsItem2,
        statsItem3
      );

      expect(statsItems1.areValid()).toEqual(true);
      expect(statsItems2.areValid()).toEqual(false);
    });
  });

  describe('haveValues', () => {
    it('no items', () => {
      const statsItems: StatsItems = StatsItems.ofSpread();

      expect(statsItems.haveValues()).toEqual(false);
    });

    it('no values', () => {
      const statsItems1: StatsItems = StatsItems.ofSpread(
        new MockStatsItem({
          values: new MockStatsValues()
        })
      );
      const statsItems2: StatsItems = StatsItems.ofSpread(
        new MockStatsItem({}),
        new MockStatsItem({})
      );

      expect(statsItems1.haveValues()).toEqual(false);
      expect(statsItems2.haveValues()).toEqual(false);
    });

    it('have values', () => {
      const statsItems: StatsItems = StatsItems.ofSpread(
        new MockStatsItem({
          values: new MockStatsValues(
            new MockStatsValue({
              value: new MockNumericalValue()
            })
          )
        })
      );

      expect(statsItems.haveValues()).toEqual(true);
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
      const statsItems: StatsItems = StatsItems.ofSpread(
        statsItem1,
        statsItem2
      );

      expect(statsItems.contains(statsItem1)).toEqual(true);
      expect(statsItems.contains(statsItem2)).toEqual(true);
      expect(statsItems.contains(statsItem3)).toEqual(false);
      expect(statsItems.contains(statsItem4)).toEqual(true);
    });
  });

  describe('copy', () => {
    it('shallow copied', () => {
      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItem3: MockStatsItem = new MockStatsItem();
      const statsItems: StatsItems = StatsItems.ofSpread(
        statsItem1,
        statsItem2,
        statsItem3
      );

      const copied: StatsItems = statsItems.copy();

      expect(statsItems).not.toBe(copied);
      expect(copied.get(0).get().equals(statsItem1)).toEqual(true);
      expect(copied.get(1).get().equals(statsItem2)).toEqual(true);
      expect(copied.get(2).get().equals(statsItem3)).toEqual(true);
      expect(copied.get(0).get()).toEqual(statsItem1);
      expect(copied.get(1).get()).toEqual(statsItem2);
      expect(copied.get(2).get()).toEqual(statsItem3);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements are 0', () => {
      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItems1: StatsItems = StatsItems.ofSpread(
        statsItem1,
        statsItem2
      );
      const statsItems2: StatsItems = StatsItems.ofSpread();

      expect(statsItems1.isEmpty()).toEqual(false);
      expect(statsItems2.isEmpty()).toEqual(true);
    });
  });

  describe('equals', () => {
    it('returns false if the length is differnet', () => {
      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItems1: StatsItems = StatsItems.ofSpread(
        statsItem1,
        statsItem2
      );
      const statsItems2: StatsItems = StatsItems.ofSpread(
        statsItem2
      );

      expect(statsItems1.equals(statsItems1)).toEqual(true);
      expect(statsItems1.equals(statsItems2)).toEqual(false);
    });

    it('returns false if the sequence is different', () => {
      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItems1: StatsItems = StatsItems.ofSpread(
        statsItem1,
        statsItem2
      );
      const statsItems2: StatsItems = StatsItems.ofSpread(
        statsItem2,
        statsItem1
      );

      expect(statsItems1.equals(statsItems1)).toEqual(true);
      expect(statsItems1.equals(statsItems2)).toEqual(false);
    });

    it('returns true if the elements and their order are same', () => {
      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItems1: StatsItems = StatsItems.ofSpread(
        statsItem1,
        statsItem2
      );
      const statsItems2: StatsItems = StatsItems.ofSpread(
        statsItem1,
        statsItem2
      );

      expect(statsItems1.equals(statsItems1)).toEqual(true);
      expect(statsItems1.equals(statsItems2)).toEqual(true);
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
      const statsItems1: StatsItems = StatsItems.ofSpread(
        new MockStatsItem({
          statsItemID: statsItemID1,
          name: new MockStatsItemName(name1)
        }),
        new MockStatsItem({
          statsItemID: statsItemID2,
          name: new MockStatsItemName(name2)
        })
      );
      const statsItems2: StatsItems = StatsItems.ofSpread(
        new MockStatsItem({
          statsItemID: statsItemID1,
          name: new MockStatsItemName(name1)
        })
      );
      const statsItems3: StatsItems = StatsItems.ofSpread(
        new MockStatsItem({
          statsItemID: statsItemID2,
          name: new MockStatsItemName(name2)
        })
      );
      const statsItems4: StatsItems = StatsItems.ofSpread(
        new MockStatsItem({
          statsItemID: statsItemID2,
          name: new MockStatsItemName(name2)
        }),
        new MockStatsItem({
          statsItemID: statsItemID1,
          name: new MockStatsItemName(name1)
        })
      );
      const statsItems5: StatsItems = StatsItems.ofSpread(
        new MockStatsItem({
          statsItemID: statsItemID1,
          name: new MockStatsItemName(name1)
        }),
        new MockStatsItem({
          statsItemID: statsItemID2,
          name: new MockStatsItemName(name2)
        })
      );
      const statsItems6: StatsItems = StatsItems.ofSpread(
        new MockStatsItem({
          statsItemID: statsItemID1,
          name: new MockStatsItemName(name3)
        }),
        new MockStatsItem({
          statsItemID: statsItemID2,
          name: new MockStatsItemName(name2)
        })
      );
      const statsItems7: StatsItems = StatsItems.ofSpread(
        new MockStatsItem({
          statsItemID: statsItemID1,
          name: new MockStatsItemName(name1)
        }),
        new MockStatsItem({
          statsItemID: statsItemID2,
          name: new MockStatsItemName(name4)
        })
      );
      const statsItems8: StatsItems = StatsItems.ofSpread(
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
      );
      const statsItems9: StatsItems = StatsItems.ofSpread(
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
      );
      const statsItems10: StatsItems = StatsItems.ofSpread(
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
      );

      expect(statsItems1.areSame(statsItems1)).toEqual(true);
      expect(statsItems1.areSame(statsItems2)).toEqual(false);
      expect(statsItems1.areSame(statsItems3)).toEqual(false);
      expect(statsItems1.areSame(statsItems4)).toEqual(false);
      expect(statsItems1.areSame(statsItems5)).toEqual(true);
      expect(statsItems1.areSame(statsItems6)).toEqual(false);
      expect(statsItems1.areSame(statsItems7)).toEqual(false);
      expect(statsItems1.areSame(statsItems8)).toEqual(false);
      expect(statsItems1.areSame(statsItems9)).toEqual(false);
      expect(statsItems1.areSame(statsItems10)).toEqual(false);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const statsItems: StatsItems = StatsItems.ofSpread(
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
      );

      expect(statsItems.toJSON()).toEqual([
        {
          statsItemID: '8f7b1783-b09c-4010-aac1-dca1292ee700',
          name: 'stats item 1',
          values: [
          ]
        },
        {
          statsItemID: '9e6b3c69-580c-4c19-9f3f-9bd82f582551',
          name: 'stats item 2',
          values: [
          ]
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
      const statsItems: StatsItems = StatsItems.ofSpread(
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
      );

      expect(statsItems.toString()).toEqual(`${id1} ${name1} , ${id2} ${name2} `);
    });
  });
});
