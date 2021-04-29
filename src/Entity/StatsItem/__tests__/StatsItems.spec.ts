import { Nullable } from '@jamashita/anden-type';
import { UUID } from '@jamashita/anden-uuid';
import { ImmutableProject, ImmutableSequence, MockSequence } from '@jamashita/lluvia-collection';
import sinon, { SinonSpy } from 'sinon';
import { AsOfs } from '../../../VO/AsOf/AsOfs';
import { MockAsOf } from '../../../VO/AsOf/Mock/MockAsOf';
import { MockColumn } from '../../../VO/Coordinate/Mock/MockColumn';
import { MockRow } from '../../../VO/Coordinate/Mock/MockRow';
import { ValueContained } from '../../../VO/NumericalValue/ValueContained';
import { StatsItemError } from '../../../VO/StatsItem/Error/StatsItemError';
import { MockStatsItemID } from '../../../VO/StatsItem/Mock/MockStatsItemID';
import { MockStatsItemName } from '../../../VO/StatsItem/Mock/MockStatsItemName';
import { StatsItemID } from '../../../VO/StatsItem/StatsItemID';
import { StatsItemName } from '../../../VO/StatsItem/StatsItemName';
import { StatsItemNames } from '../../../VO/StatsItem/StatsItemNames';
import { MockStatsValue } from '../../../VO/StatsValue/Mock/MockStatsValue';
import { MockStatsValues } from '../../../VO/StatsValue/Mock/MockStatsValues';
import { StatsValues } from '../../../VO/StatsValue/StatsValues';
import { MockStatsItem } from '../Mock/MockStatsItem';
import { StatsItem, StatsItemJSON, StatsItemRow } from '../StatsItem';
import { StatsItems } from '../StatsItems';

describe('StatsItems', () => {
  describe('ofJSON', () => {
    it('normal case', () => {
      expect.assertions(5);

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

      const items: StatsItems = StatsItems.ofJSON(json);

      expect(items.size()).toBe(2);
      for (let i: number = 0; i < items.size(); i++) {
        const item: Nullable<StatsItem> = items.get(i);

        expect(item?.getStatsItemID().get().get()).toBe(json[i]!.statsItemID);
        expect(item?.getName().get()).toBe(json[i]!.name);
      }
    });

    it('contains malformat statsItemID', () => {
      expect.assertions(1);

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

      expect(() => {
        StatsItems.ofJSON(json);
      }).toThrow(StatsItemError);
    });

    it('contains malformat statsItemIDs', () => {
      expect.assertions(1);

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

      expect(() => {
        StatsItems.ofJSON(json);
      }).toThrow(StatsItemError);
    });
  });

  describe('ofRow', () => {
    it('normal case', () => {
      expect.assertions(13);

      const statsItemID1: string = 'b1524ae3-8e91-4938-9997-579ef7b84602';
      const statsItemID2: string = '1f0719d6-6512-43b3-93f9-2a92bcb51e32';
      const row: Array<StatsItemRow> = [
        {
          statsItemID: statsItemID1,
          name: 'stats name 1'
        },
        {
          statsItemID: statsItemID2,
          name: 'stats name 2'
        }
      ];
      const asOf1: MockAsOf = new MockAsOf({
        day: 1
      });
      const asOf2: MockAsOf = new MockAsOf({
        day: 2
      });
      const asOf3: MockAsOf = new MockAsOf({
        day: 3
      });
      const project: ImmutableProject<StatsItemID, StatsValues> = ImmutableProject.ofMap<StatsItemID, StatsValues>(
        new Map<StatsItemID, StatsValues>([
          [
            StatsItemID.of(UUID.of(statsItemID1)),
            new MockStatsValues(
              new MockStatsValue({
                asOf: asOf2,
                value: ValueContained.of(1)
              }),
              new MockStatsValue({
                asOf: asOf3,
                value: ValueContained.of(3)
              })
            )
          ],
          [
            StatsItemID.of(UUID.of(statsItemID2)),
            new MockStatsValues(
              new MockStatsValue({
                asOf: asOf1,
                value: ValueContained.of(0)
              }),
              new MockStatsValue({
                asOf: asOf3,
                value: ValueContained.of(3)
              })
            )
          ]
        ])
      );

      const items: StatsItems = StatsItems.ofRow(row, project);

      expect(items.size()).toBe(2);
      for (let i: number = 0; i < items.size(); i++) {
        expect(items.get(i)?.getStatsItemID().get().get()).toBe(row[i]!.statsItemID);
        expect(items.get(i)?.getName().get()).toBe(row[i]!.name);
      }
      expect(items.get(0)?.getValues().size()).toBe(2);
      expect(items.get(0)?.getValues().get(asOf1)).toBeNull();
      expect(items.get(0)?.getValues().get(asOf2)?.getValue().get()).toBe(1);
      expect(items.get(0)?.getValues().get(asOf3)?.getValue().get()).toBe(3);
      expect(items.get(1)?.getValues().size()).toBe(2);
      expect(items.get(1)?.getValues().get(asOf1)?.getValue().get()).toBe(0);
      expect(items.get(1)?.getValues().get(asOf2)).toBeNull();
      expect(items.get(1)?.getValues().get(asOf3)?.getValue().get()).toBe(3);
    });

    it('contains malformat statsItemID', () => {
      expect.assertions(1);

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

      expect(() => {
        StatsItems.ofRow(row, ImmutableProject.empty<StatsItemID, StatsValues>());
      }).toThrow(StatsItemError);
    });

    it('contains malformat statsItemIDs', () => {
      expect.assertions(1);

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

      expect(() => {
        StatsItems.ofRow(row, ImmutableProject.empty<StatsItemID, StatsValues>());
      }).toThrow(StatsItemError);
    });
  });

  describe('validate', () => {
    it('normal case', () => {
      expect.assertions(1);

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

      expect(StatsItems.validate(n)).toBe(true);
    });

    it('returns false because given parameter is not an object', () => {
      expect.assertions(5);

      expect(StatsItems.validate(null)).toBe(false);
      expect(StatsItems.validate(undefined)).toBe(false);
      expect(StatsItems.validate(56)).toBe(false);
      expect(StatsItems.validate('fjafsd')).toBe(false);
      expect(StatsItems.validate(false)).toBe(false);
    });

    it('returns false because given parameter is not an array', () => {
      expect.assertions(1);

      expect(StatsItems.validate({})).toBe(false);
    });

    it('returns false because the first element would not be StatsItemJSON', () => {
      expect.assertions(1);

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

      expect(StatsItems.validate(n)).toBe(false);
    });

    it('returns false because the second element would not be StatsItemJSON', () => {
      expect.assertions(1);

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

      expect(StatsItems.validate(n)).toBe(false);
    });
  });

  describe('ofArray', () => {
    it('normal case', () => {
      expect.assertions(4);

      const items: Array<MockStatsItem> = [new MockStatsItem(), new MockStatsItem(), new MockStatsItem()];

      const statsItems: StatsItems = StatsItems.ofArray(items);

      expect(statsItems.size()).toBe(items.length);
      for (let i: number = 0; i < statsItems.size(); i++) {
        expect(statsItems.get(i)).toBe(items[i]);
      }
    });
  });

  describe('ofSpread', () => {
    it('normal case', () => {
      expect.assertions(4);

      const item1: MockStatsItem = new MockStatsItem();
      const item2: MockStatsItem = new MockStatsItem();
      const item3: MockStatsItem = new MockStatsItem();

      const statsItems: StatsItems = StatsItems.ofSpread(item1, item2, item3);

      expect(statsItems.size()).toBe(3);
      expect(statsItems.get(0)).toBe(item1);
      expect(statsItems.get(1)).toBe(item2);
      expect(statsItems.get(2)).toBe(item3);
    });
  });

  describe('of', () => {
    it('normal case', () => {
      expect.assertions(1);

      const statsItems: StatsItems = StatsItems.of(ImmutableSequence.ofArray<StatsItem>([new MockStatsItem(), new MockStatsItem()]));

      expect(statsItems).not.toBe(StatsItems.empty());
    });
  });

  describe('empty', () => {
    it('gives 0-length StatsItems', () => {
      expect.assertions(1);

      expect(StatsItems.empty().isEmpty()).toBe(true);
    });
  });

  describe('add', () => {
    it('does not affect the original one', () => {
      expect.assertions(5);

      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItem3: MockStatsItem = new MockStatsItem();
      const statsItem4: MockStatsItem = new MockStatsItem();

      const statsItems1: StatsItems = StatsItems.ofArray([statsItem1, statsItem2]);

      statsItems1.add(statsItem3);
      statsItems1.add(statsItem4);

      expect(statsItems1.size()).toBe(4);
      expect(statsItems1.get(0)).toBe(statsItem1);
      expect(statsItems1.get(1)).toBe(statsItem2);
      expect(statsItems1.get(2)).toBe(statsItem3);
      expect(statsItems1.get(3)).toBe(statsItem4);
    });
  });

  describe('get', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const sequence: MockSequence<MockStatsItem> = new MockSequence<MockStatsItem>([
        new MockStatsItem(),
        new MockStatsItem()
      ]);

      const spy: SinonSpy = sinon.spy();

      sequence.get = spy;

      const items: StatsItems = StatsItems.of(sequence);

      items.get(0);

      expect(spy.called).toBe(true);
    });
  });

  describe('move', () => {
    it('first index', () => {
      expect.assertions(4);

      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItem3: MockStatsItem = new MockStatsItem();
      const statsItems: StatsItems = StatsItems.ofArray([statsItem1, statsItem2, statsItem3]);

      statsItems.move(new MockColumn(0), new MockColumn(1));

      expect(statsItems.size()).toBe(3);
      expect(statsItems.get(0)).toBe(statsItem2);
      expect(statsItems.get(1)).toBe(statsItem1);
      expect(statsItems.get(2)).toBe(statsItem3);
    });

    it('middle index', () => {
      expect.assertions(4);

      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItem3: MockStatsItem = new MockStatsItem();
      const statsItems: StatsItems = StatsItems.ofArray([statsItem1, statsItem2, statsItem3]);

      statsItems.move(new MockColumn(1), new MockColumn(2));

      expect(statsItems.size()).toBe(3);
      expect(statsItems.get(0)).toBe(statsItem1);
      expect(statsItems.get(1)).toBe(statsItem3);
      expect(statsItems.get(2)).toBe(statsItem2);
    });

    it('last index', () => {
      expect.assertions(4);

      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItem3: MockStatsItem = new MockStatsItem();
      const statsItems: StatsItems = StatsItems.ofArray([statsItem1, statsItem2, statsItem3]);

      statsItems.move(new MockColumn(2), new MockColumn(0));

      expect(statsItems.size()).toBe(3);
      expect(statsItems.get(0)).toBe(statsItem3);
      expect(statsItems.get(1)).toBe(statsItem2);
      expect(statsItems.get(2)).toBe(statsItem1);
    });
  });

  describe('replace', () => {
    it('first index', () => {
      expect.assertions(4);

      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItem3: MockStatsItem = new MockStatsItem();
      const statsItem4: MockStatsItem = new MockStatsItem();
      const statsItems: StatsItems = StatsItems.ofArray([statsItem1, statsItem2, statsItem3]);

      statsItems.replace(statsItem4, new MockRow(0));

      expect(statsItems.size()).toBe(3);
      expect(statsItems.get(0)).toBe(statsItem4);
      expect(statsItems.get(1)).not.toBe(statsItem4);
      expect(statsItems.get(2)).not.toBe(statsItem4);
    });

    it('middle index', () => {
      expect.assertions(4);

      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItem3: MockStatsItem = new MockStatsItem();
      const statsItem4: MockStatsItem = new MockStatsItem();
      const statsItems: StatsItems = StatsItems.ofArray([statsItem1, statsItem2, statsItem3]);

      statsItems.replace(statsItem4, new MockRow(1));

      expect(statsItems.size()).toBe(3);
      expect(statsItems.get(0)).not.toBe(statsItem4);
      expect(statsItems.get(1)).toBe(statsItem4);
      expect(statsItems.get(2)).not.toBe(statsItem4);
    });

    it('last index', () => {
      expect.assertions(4);

      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItem3: MockStatsItem = new MockStatsItem();
      const statsItem4: MockStatsItem = new MockStatsItem();
      const statsItems: StatsItems = StatsItems.ofArray([statsItem1, statsItem2, statsItem3]);

      statsItems.replace(statsItem4, new MockRow(2));

      expect(statsItems.size()).toBe(3);
      expect(statsItems.get(0)).not.toBe(statsItem4);
      expect(statsItems.get(1)).not.toBe(statsItem4);
      expect(statsItems.get(2)).toBe(statsItem4);
    });
  });

  describe('remove', () => {
    it('correctly removed the same object', () => {
      expect.assertions(3);

      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItem3: MockStatsItem = new MockStatsItem();
      const statsItems: StatsItems = StatsItems.ofArray([statsItem1, statsItem2, statsItem3]);

      statsItems.remove(statsItem1);

      expect(statsItems.size()).toBe(2);
      expect(statsItems.get(0)).toBe(statsItem2);
      expect(statsItems.get(1)).toBe(statsItem3);
    });

    it('returns StatsItems.empty() when all the items are removed', () => {
      expect.assertions(1);

      const statsItem: MockStatsItem = new MockStatsItem();
      const statsItems: StatsItems = StatsItems.ofArray([statsItem]);

      statsItems.remove(statsItem);

      expect(statsItems.size()).toBe(0);
    });
  });

  describe('maxNameLength', () => {
    it('normal case', () => {
      expect.assertions(1);

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
      expect.assertions(1);

      const statsItems: StatsItems = StatsItems.ofArray([]);

      expect(statsItems.maxNameLength()).toBe(0);
    });
  });

  describe('getAsOfs', () => {
    it('collects all AsOfs even if the date is same', () => {
      expect.assertions(9);

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
      const statsItems: StatsItems = StatsItems.ofArray([statsItem1, statsItem2, statsItem3]);

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
      expect.assertions(4);

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
      expect(names.get(0)).toBe(name1);
      expect(names.get(1)).toBe(name2);
      expect(names.get(2)).toBe(name3);
    });
  });

  describe('contains', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const sequence: MockSequence<MockStatsItem> = new MockSequence<MockStatsItem>([
        new MockStatsItem(),
        new MockStatsItem()
      ]);

      const spy: SinonSpy = sinon.spy();

      sequence.contains = spy;

      const items: StatsItems = StatsItems.of(sequence);

      items.contains(new MockStatsItem());

      expect(spy.called).toBe(true);
    });
  });

  describe('size', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const sequence: MockSequence<MockStatsItem> = new MockSequence<MockStatsItem>([
        new MockStatsItem(),
        new MockStatsItem()
      ]);

      const spy: SinonSpy = sinon.spy();

      sequence.size = spy;

      const items: StatsItems = StatsItems.of(sequence);

      items.size();

      expect(spy.called).toBe(true);
    });
  });

  describe('forEach', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const sequence: MockSequence<MockStatsItem> = new MockSequence<MockStatsItem>([
        new MockStatsItem(),
        new MockStatsItem()
      ]);

      const spy: SinonSpy = sinon.spy();

      sequence.forEach = spy;

      const items: StatsItems = StatsItems.of(sequence);

      items.forEach(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('duplicate', () => {
    it('shallow duplicated', () => {
      expect.assertions(4);

      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItem3: MockStatsItem = new MockStatsItem();
      const statsItems: StatsItems = StatsItems.ofArray([statsItem1, statsItem2, statsItem3]);

      const duplicated: StatsItems = statsItems.duplicate();

      expect(statsItems).not.toBe(duplicated);
      expect(duplicated.get(0)).toBe(statsItem1);
      expect(duplicated.get(1)).toBe(statsItem2);
      expect(duplicated.get(2)).toBe(statsItem3);
    });

    it('returns StatsItems.empty when it is already empty', () => {
      expect.assertions(1);

      expect(StatsItems.empty().duplicate().size()).toBe(0);
    });
  });

  describe('isEmpty', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const sequence: MockSequence<MockStatsItem> = new MockSequence<MockStatsItem>([
        new MockStatsItem(),
        new MockStatsItem()
      ]);

      const spy: SinonSpy = sinon.spy();

      sequence.isEmpty = spy;

      const items: StatsItems = StatsItems.of(sequence);

      items.isEmpty();

      expect(spy.called).toBe(true);
    });
  });

  describe('equals', () => {
    it('same instance', () => {
      expect.assertions(1);

      const statsItem1: MockStatsItem = new MockStatsItem();
      const statsItem2: MockStatsItem = new MockStatsItem();
      const statsItems: StatsItems = StatsItems.ofArray([statsItem1, statsItem2]);

      expect(statsItems.equals(statsItems)).toBe(true);
    });

    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const sequence: MockSequence<MockStatsItem> = new MockSequence<MockStatsItem>([
        new MockStatsItem(),
        new MockStatsItem()
      ]);

      const spy: SinonSpy = sinon.spy();

      sequence.equals = spy;

      const items: StatsItems = StatsItems.of(sequence);

      items.equals(StatsItems.empty());

      expect(spy.called).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      expect.assertions(1);

      const statsItems: StatsItems = StatsItems.ofArray([
        StatsItem.of(
          StatsItemID.ofString('8f7b1783-b09c-4010-aac1-dca1292ee700'),
          StatsItemName.of('stats item 1'),
          StatsValues.empty()
        ),
        StatsItem.of(
          StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551'),
          StatsItemName.of('stats item 2'),
          StatsValues.empty()
        )
      ]);

      expect(statsItems.toJSON()).toStrictEqual([
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
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const sequence: MockSequence<MockStatsItem> = new MockSequence<MockStatsItem>([
        new MockStatsItem(),
        new MockStatsItem()
      ]);

      const spy: SinonSpy = sinon.spy();

      sequence.toString = spy;

      const items: StatsItems = StatsItems.of(sequence);

      items.toString();

      expect(spy.called).toBe(true);
    });
  });

  describe('iterator', () => {
    it('normal case', () => {
      expect.assertions(3);

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

      const statsItems: StatsItems = StatsItems.ofArray([statsItem1, statsItem2, statsItem3]);

      let i: number = 0;

      for (const [, v] of statsItems) {
        expect(v).toBe(statsItems.get(i));
        i++;
      }
    });
  });

  describe('every', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const sequence: MockSequence<MockStatsItem> = new MockSequence<MockStatsItem>([
        new MockStatsItem(),
        new MockStatsItem()
      ]);

      const spy: SinonSpy = sinon.spy();

      sequence.every = spy;

      const items: StatsItems = StatsItems.of(sequence);

      items.every(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('some', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const sequence: MockSequence<MockStatsItem> = new MockSequence<MockStatsItem>([
        new MockStatsItem(),
        new MockStatsItem()
      ]);

      const spy: SinonSpy = sinon.spy();

      sequence.some = spy;

      const items: StatsItems = StatsItems.of(sequence);

      items.some(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('areFilled', () => {
    it('returns true if the all items are filled', () => {
      expect.assertions(2);

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
        new MockStatsItem({
          name: StatsItemName.empty()
        })
      ]);

      expect(statsItems1.areFilled()).toBe(true);
      expect(statsItems2.areFilled()).toBe(false);
    });
  });

  describe('haveValues', () => {
    it('no items', () => {
      expect.assertions(1);

      const statsItems: StatsItems = StatsItems.ofArray([]);

      expect(statsItems.haveValues()).toBe(false);
    });

    it('no values', () => {
      expect.assertions(2);

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
      expect.assertions(1);

      const statsItems: StatsItems = StatsItems.ofArray([
        new MockStatsItem({
          values: new MockStatsValues(
            new MockStatsValue({
              value: ValueContained.of()
            })
          )
        })
      ]);

      expect(statsItems.haveValues()).toBe(true);
    });
  });

  describe('same', () => {
    it('same instance', () => {
      expect.assertions(1);

      const statsItems1: StatsItems = StatsItems.empty();

      expect(statsItems1.same(statsItems1)).toBe(true);
    });

    it('returns true', () => {
      expect.assertions(1);

      const statsItemID1: MockStatsItemID = new MockStatsItemID();
      const statsItemID2: MockStatsItemID = new MockStatsItemID();

      const statsItems1: StatsItems = StatsItems.ofArray([
        new MockStatsItem({
          statsItemID: statsItemID1
        }),
        new MockStatsItem({
          statsItemID: statsItemID2
        })
      ]);
      const statsItems2: StatsItems = StatsItems.ofArray([
        new MockStatsItem({
          statsItemID: statsItemID1
        }),
        new MockStatsItem({
          statsItemID: statsItemID2
        })
      ]);

      expect(statsItems1.same(statsItems2)).toBe(true);
    });

    it('returns false when the length is different', () => {
      expect.assertions(1);

      const statsItems1: StatsItems = StatsItems.ofArray([
        new MockStatsItem(),
        new MockStatsItem()
      ]);
      const statsItems2: StatsItems = StatsItems.ofArray([
        new MockStatsItem(),
        new MockStatsItem(),
        new MockStatsItem()
      ]);
      expect(statsItems1.same(statsItems2)).toBe(false);
    });
  });
});
