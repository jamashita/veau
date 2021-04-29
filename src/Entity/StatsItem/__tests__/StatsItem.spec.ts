import { Nullable } from '@jamashita/anden-type';
import { UUID } from '@jamashita/anden-uuid';
import { ImmutableProject } from '@jamashita/lluvia-collection';
import { AsOf } from '../../../VO/AsOf/AsOf';
import { MockAsOf } from '../../../VO/AsOf/Mock/MockAsOf';
import { MockAsOfs } from '../../../VO/AsOf/Mock/MockAsOfs';
import { NumericalValues } from '../../../VO/NumericalValue/NumericalValues';
import { ValueContained } from '../../../VO/NumericalValue/ValueContained';
import { StatsItemError } from '../../../VO/StatsItem/Error/StatsItemError';
import { MockStatsItemID } from '../../../VO/StatsItem/Mock/MockStatsItemID';
import { MockStatsItemName } from '../../../VO/StatsItem/Mock/MockStatsItemName';
import { StatsItemID } from '../../../VO/StatsItem/StatsItemID';
import { StatsItemName } from '../../../VO/StatsItem/StatsItemName';
import { MockStatsValue } from '../../../VO/StatsValue/Mock/MockStatsValue';
import { MockStatsValues } from '../../../VO/StatsValue/Mock/MockStatsValues';
import { StatsValue } from '../../../VO/StatsValue/StatsValue';
import { StatsValues } from '../../../VO/StatsValue/StatsValues';
import { StatsItem, StatsItemJSON, StatsItemRow } from '../StatsItem';

describe('StatsItem', () => {
  describe('of', () => {
    it('normal case', () => {
      expect.assertions(3);

      const statsItemID: MockStatsItemID = new MockStatsItemID();
      const name: MockStatsItemName = new MockStatsItemName();
      const statsValue: MockStatsValue = new MockStatsValue();

      const statsItem: StatsItem = StatsItem.of(statsItemID, name, new MockStatsValues(statsValue));

      expect(statsItem.getStatsItemID()).toBe(statsItemID);
      expect(statsItem.getName()).toBe(name);
      expect(statsItem.getValues().contains(statsValue)).toBe(true);
    });
  });

  describe('ofJSON', () => {
    it('normal case', () => {
      expect.assertions(7);

      const asOf1: string = '2000-01-01';
      const asOf2: string = '2000-01-02';
      const json: StatsItemJSON = {
        statsItemID: '4d0cf4e5-4f48-4db3-9c04-085374d857d1',
        name: 'name',
        values: [
          {
            asOf: asOf1,
            value: 10
          },
          {
            asOf: asOf2,
            value: 100
          }
        ]
      };

      const statsItem: StatsItem = StatsItem.ofJSON(json);

      expect(statsItem.getStatsItemID().get().get()).toBe(json.statsItemID);
      expect(statsItem.getName().get()).toBe(json.name);
      expect(statsItem.getValues().size()).toBe(json.values.length);
      const statsValue1: Nullable<StatsValue> = statsItem.getValues().get(AsOf.ofString(asOf1));

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(statsValue1?.getAsOf().toString()).toBe(json.values[0]!.asOf);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(statsValue1?.getValue().get()).toBe(json.values[0]!.value);

      const statsValue2: Nullable<StatsValue> = statsItem.getValues().get(AsOf.ofString(asOf2));

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(statsValue2?.getAsOf().toString()).toBe(json.values[1]!.asOf);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(statsValue2?.getValue().get()).toBe(json.values[1]!.value);
    });

    it('statsItemID is malformat', () => {
      expect.assertions(1);

      const json: StatsItemJSON = {
        statsItemID: 'illegal uuid format',
        name: 'name',
        values: [
          {
            asOf: '2000-01-01',
            value: 10
          },
          {
            asOf: '2000-01-02',
            value: 100
          }
        ]
      };

      expect(() => {
        StatsItem.ofJSON(json);
      }).toThrow(StatsItemError);
    });

    it('some asOf is malformat', () => {
      expect.assertions(1);

      const json: StatsItemJSON = {
        statsItemID: '4d0cf4e5-4f48-4db3-9c04-085374d857d1',
        name: 'name',
        values: [
          {
            asOf: 'illegal asOf format',
            value: 10
          },
          {
            asOf: '2000-01-02',
            value: 100
          }
        ]
      };

      expect(() => {
        StatsItem.ofJSON(json);
      }).toThrow(StatsItemError);
    });

    it('all asOf are malformat', () => {
      expect.assertions(1);

      const json: StatsItemJSON = {
        statsItemID: '4d0cf4e5-4f48-4db3-9c04-085374d857d1',
        name: 'name',
        values: [
          {
            asOf: 'illegal asOf format 1',
            value: 10
          },
          {
            asOf: 'illegal asOf format 2',
            value: 100
          }
        ]
      };

      expect(() => {
        StatsItem.ofJSON(json);
      }).toThrow(StatsItemError);
    });
  });

  describe('ofRow', () => {
    it('normal case', () => {
      expect.assertions(8);

      const statsItemID1: string = '4d0cf4e5-4f48-4db3-9c04-085374d857d1';
      const statsItemID2: string = '4d0cf4e5-4f48-4db3-9c04-085374d857d2';
      const row: StatsItemRow = {
        statsItemID: statsItemID1,
        name: 'name'
      };
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
            StatsItemID.ofString(statsItemID1),
            StatsValues.ofSpread(
              new MockStatsValue({
                asOf: asOf1,
                value: ValueContained.of(10)
              }),
              new MockStatsValue({
                asOf: asOf2,
                value: ValueContained.of(100)
              }),
              new MockStatsValue({
                asOf: asOf3,
                value: ValueContained.of(1000)
              })
            )
          ],
          [
            StatsItemID.ofString(statsItemID2),
            StatsValues.ofSpread(
              new MockStatsValue({
                asOf: asOf1,
                value: ValueContained.of(11)
              }),
              new MockStatsValue({
                asOf: asOf2,
                value: ValueContained.of(101)
              }),
              new MockStatsValue({
                asOf: asOf3,
                value: ValueContained.of(1001)
              })
            )
          ]
        ])
      );

      const statsItem: StatsItem = StatsItem.ofRow(row, project);

      expect(statsItem.getStatsItemID().get().get()).toBe(row.statsItemID);
      expect(statsItem.getName().get()).toBe(row.name);

      const statsValue1: Nullable<StatsValue> = statsItem.getValues().get(asOf1);
      const v1: Nullable<StatsValue> = statsItem.getValues().get(asOf1);

      expect(statsValue1?.getAsOf()).toBe(v1?.getAsOf());
      expect(statsValue1?.getValue()).toBe(v1?.getValue());

      const statsValue2: Nullable<StatsValue> = statsItem.getValues().get(asOf2);
      const v2: Nullable<StatsValue> = statsItem.getValues().get(asOf2);

      expect(statsValue2?.getAsOf()).toBe(v2?.getAsOf());
      expect(statsValue2?.getValue()).toBe(v2?.getValue());

      const statsValue3: Nullable<StatsValue> = statsItem.getValues().get(asOf3);
      const v3: Nullable<StatsValue> = statsItem.getValues().get(asOf3);

      expect(statsValue3?.getAsOf()).toBe(v3?.getAsOf());
      expect(statsValue3?.getValue()).toBe(v3?.getValue());
    });

    it('does not have values of that StatsItemID', () => {
      expect.assertions(3);

      const row: StatsItemRow = {
        statsItemID: '4d0cf4e5-4f48-4db3-9c04-085374d857d1',
        name: 'name'
      };
      const asOf1: MockAsOf = new MockAsOf({
        day: 1
      });
      const asOf2: MockAsOf = new MockAsOf({
        day: 2
      });
      const asOf3: MockAsOf = new MockAsOf({
        day: 3
      });
      const statsValues: StatsValues = StatsValues.ofArray([
        new MockStatsValue({
          asOf: asOf1,
          value: ValueContained.of(10)
        }),
        new MockStatsValue({
          asOf: asOf2,
          value: ValueContained.of(100)
        }),
        new MockStatsValue({
          asOf: asOf3,
          value: ValueContained.of(1000)
        })
      ]);

      const statsItem: StatsItem = StatsItem.ofRow(
        row,
        ImmutableProject.ofMap(
          new Map<StatsItemID, StatsValues>([
            [StatsItemID.ofString('4d0cf4e5-4f48-4db3-9c04-085374d857d2'), statsValues]
          ])
        )
      );

      expect(statsItem.getStatsItemID().get().get()).toBe(row.statsItemID);
      expect(statsItem.getName().get()).toBe(row.name);
      expect(statsItem.getValues().size()).toBe(0);
    });

    it('statsItemID is malformat', () => {
      expect.assertions(1);

      const row: StatsItemRow = {
        statsItemID: 'illegal uuid format',
        name: 'name'
      };
      const statsValues: StatsValues = StatsValues.ofArray([
        new MockStatsValue({
          asOf: new MockAsOf({
            day: 1
          }),
          value: ValueContained.of(10)
        }),
        new MockStatsValue({
          asOf: new MockAsOf({
            day: 2
          }),
          value: ValueContained.of(100)
        }),
        new MockStatsValue({
          asOf: new MockAsOf({
            day: 3
          }),
          value: ValueContained.of(1000)
        })
      ]);

      expect(() => {
        StatsItem.ofRow(
          row,
          ImmutableProject.ofMap(
            new Map<StatsItemID, StatsValues>([
              [StatsItemID.ofString('4d0cf4e5-4f48-4db3-9c04-085374d857d1'), statsValues]
            ])
          )
        );
      }).toThrow(StatsItemError);
    });
  });

  describe('validate', () => {
    it('normal case', () => {
      expect.assertions(1);

      const n: unknown = {
        statsItemID: 'ding dong',
        name: 'cameleon',
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
      };

      expect(StatsItem.validate(n)).toBe(true);
    });

    it('returns false because given parameter is not an object', () => {
      expect.assertions(5);

      expect(StatsItem.validate(null)).toBe(false);
      expect(StatsItem.validate(undefined)).toBe(false);
      expect(StatsItem.validate(56)).toBe(false);
      expect(StatsItem.validate('fjafsd')).toBe(false);
      expect(StatsItem.validate(false)).toBe(false);
    });

    it('returns false because statsItemID is missing', () => {
      expect.assertions(1);

      const n: unknown = {
        name: 'cameleon',
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
      };

      expect(StatsItem.validate(n)).toBe(false);
    });

    it('returns false because statsItemID is not string', () => {
      expect.assertions(1);

      const n: unknown = {
        statsItemID: -1,
        name: 'cameleon',
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
      };

      expect(StatsItem.validate(n)).toBe(false);
    });

    it('returns false because name is missing', () => {
      expect.assertions(1);

      const n: unknown = {
        statsItemID: 'ding dong',
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
      };

      expect(StatsItem.validate(n)).toBe(false);
    });

    it('returns false because name is not string', () => {
      expect.assertions(1);

      const n: unknown = {
        statsItemID: 'ding dong',
        name: false,
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
      };

      expect(StatsItem.validate(n)).toBe(false);
    });

    it('returns false because values is missing', () => {
      expect.assertions(1);

      const n: unknown = {
        statsItemID: 'ding dong',
        name: 'cameleon'
      };

      expect(StatsItem.validate(n)).toBe(false);
    });

    it('returns false because values is not array', () => {
      expect.assertions(1);

      const n: unknown = {
        statsItemID: 'ding dong',
        name: 'cameleon',
        values: {}
      };

      expect(StatsItem.validate(n)).toBe(false);
    });
  });

  describe('default', () => {
    it('id will be generated, data are empty', () => {
      expect.assertions(3);

      const item: StatsItem = StatsItem.default();

      expect(item.getStatsItemID().get().get()).toHaveLength(UUID.size());
      expect(item.getName()).toBe(StatsItemName.empty());
      expect(item.getValues().isEmpty()).toBe(true);
    });
  });

  describe('equals', () => {
    it('returns true when the ids equal', () => {
      expect.assertions(3);

      const statsItemID1: MockStatsItemID = new MockStatsItemID();
      const statsItemID2: MockStatsItemID = new MockStatsItemID();
      const statsItem1: StatsItem = StatsItem.of(statsItemID1, new MockStatsItemName(), new MockStatsValues());
      const statsItem2: StatsItem = StatsItem.of(statsItemID2, new MockStatsItemName(), new MockStatsValues());
      const statsItem3: StatsItem = StatsItem.of(
        statsItemID1,
        StatsItemName.of('name 3'),
        new MockStatsValues(new MockStatsValue())
      );

      expect(statsItem1.equals(statsItem1)).toBe(true);
      expect(statsItem1.equals(statsItem2)).toBe(false);
      expect(statsItem1.equals(statsItem3)).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      expect.assertions(1);

      const statsItemID: StatsItemID = StatsItemID.ofString('b5f208c3-f171-488f-a8dc-f3798db5f9f4');
      const statsItem: StatsItem = StatsItem.of(
        statsItemID,
        StatsItemName.of('name 1'),
        StatsValues.ofSpread(
          StatsValue.of(AsOf.ofString('2000-01-01'), ValueContained.of(10)),
          StatsValue.of(AsOf.ofString('2000-01-02'), ValueContained.of(100))
        )
      );

      expect(statsItem.toJSON()).toStrictEqual({
        statsItemID: 'b5f208c3-f171-488f-a8dc-f3798db5f9f4',
        name: 'name 1',
        values: [
          {
            asOf: '2000-01-01',
            value: 10
          },
          {
            asOf: '2000-01-02',
            value: 100
          }
        ]
      });
    });
  });

  describe('getAdOfs', () => {
    it('extracts only their asOfs', () => {
      expect.assertions(3);

      const asOf1: MockAsOf = new MockAsOf({
        day: 1
      });
      const asOf2: MockAsOf = new MockAsOf({
        day: 3
      });
      const statsItem: StatsItem = StatsItem.of(
        new MockStatsItemID(),
        new MockStatsItemName(),
        new MockStatsValues(
          new MockStatsValue({
            asOf: asOf1
          }),
          new MockStatsValue({
            asOf: asOf2
          })
        )
      );

      expect(statsItem.getAsOfs().size()).toBe(2);
      expect(statsItem.getAsOfs().get(0)).toBe(asOf1);
      expect(statsItem.getAsOfs().get(1)).toBe(asOf2);
    });
  });

  describe('delete', () => {
    it('normal case', () => {
      expect.assertions(2);

      const asOf1: MockAsOf = new MockAsOf({
        day: 4
      });
      const asOf2: MockAsOf = new MockAsOf({
        day: 5
      });
      const statsItem: StatsItem = StatsItem.of(
        new MockStatsItemID(),
        StatsItemName.empty(),
        new MockStatsValues(
          new MockStatsValue({
            asOf: asOf1
          }),
          new MockStatsValue({
            asOf: asOf2
          })
        )
      );

      statsItem.delete(asOf1);
      const values: StatsValues = statsItem.getValues();

      expect(values.size()).toBe(1);
      expect(values.get(asOf1)).toBeNull();
    });
  });

  describe('duplicate', () => {
    it('evert properties are duplicated', () => {
      expect.assertions(4);

      const statsItemID: MockStatsItemID = new MockStatsItemID();
      const name: MockStatsItemName = new MockStatsItemName();
      const statsValues: MockStatsValues = new MockStatsValues();

      const statsItem: StatsItem = StatsItem.of(statsItemID, name, statsValues);
      const duplicated: StatsItem = statsItem.duplicate();

      expect(statsItem).not.toBe(duplicated);
      expect(statsItem.getStatsItemID()).toBe(statsItemID);
      expect(statsItem.getName()).toBe(name);
      expect(statsItem.getValues()).toBe(statsValues);
    });
  });

  describe('getValuesByColumn', () => {
    it('returns empty string when the date is empty', () => {
      expect.assertions(4);

      const column: MockAsOfs = new MockAsOfs(
        new MockAsOf({
          day: 1
        }),
        new MockAsOf({
          day: 2
        }),
        new MockAsOf({
          day: 3
        })
      );
      const statsItem: StatsItem = StatsItem.of(
        new MockStatsItemID(),
        new MockStatsItemName(),
        new MockStatsValues(
          new MockStatsValue({
            asOf: new MockAsOf({
              day: 1
            }),
            value: ValueContained.of(1)
          }),
          new MockStatsValue({
            asOf: new MockAsOf({
              day: 3
            }),
            value: ValueContained.of(3)
          })
        )
      );

      const values: NumericalValues = statsItem.getValuesByColumn(column);

      expect(values.size()).toBe(3);
      expect(values.get(0)?.toString()).toBe('1');
      expect(values.get(1)?.toString()).toBe('');
      expect(values.get(2)?.toString()).toBe('3');
    });
  });

  describe('isFilled', () => {
    it('returns true if the name is filled', () => {
      expect.assertions(2);

      const statsItem1: StatsItem = StatsItem.of(
        new MockStatsItemID(),
        StatsItemName.empty(),
        new MockStatsValues()
      );
      const statsItem2: StatsItem = StatsItem.of(
        new MockStatsItemID(),
        StatsItemName.of('name'),
        new MockStatsValues()
      );

      expect(statsItem1.isFilled()).toBe(false);
      expect(statsItem2.isFilled()).toBe(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      expect.assertions(1);

      const id: string = '5ee0c273-c26f-432f-9217-d6a7b481a073';
      const name: string = 'name';
      const statsItemID: StatsItemID = StatsItemID.ofString(id);
      const statsItemName: StatsItemName = StatsItemName.of(name);
      const statsValues: StatsValues = StatsValues.empty();

      const statsItem: StatsItem = StatsItem.of(statsItemID, statsItemName, statsValues);

      expect(statsItem.toString()).toBe(`${id} ${name} `);
    });
  });

  describe('same', () => {
    it('returns true if all the properties are the same', () => {
      expect.assertions(6);

      const statsItemID1: MockStatsItemID = new MockStatsItemID();
      const statsItemID2: MockStatsItemID = new MockStatsItemID();
      const statsItem1: StatsItem = StatsItem.of(
        statsItemID1,
        new MockStatsItemName(),
        new MockStatsValues()
      );
      const statsItem2: StatsItem = StatsItem.of(
        statsItemID2,
        new MockStatsItemName(),
        new MockStatsValues()
      );
      const statsItem3: StatsItem = StatsItem.of(
        statsItemID1,
        new MockStatsItemName('name 3'),
        new MockStatsValues(new MockStatsValue())
      );
      const statsItem4: StatsItem = StatsItem.of(
        statsItemID1,
        new MockStatsItemName(),
        new MockStatsValues(new MockStatsValue(), new MockStatsValue())
      );
      const statsItem5: StatsItem = StatsItem.of(
        statsItemID2,
        new MockStatsItemName(),
        new MockStatsValues(
          new MockStatsValue({
            asOf: new MockAsOf({
              day: 2
            })
          })
        )
      );
      const statsItem6: StatsItem = StatsItem.of(
        statsItemID1,
        new MockStatsItemName(),
        new MockStatsValues()
      );

      expect(statsItem1.same(statsItem1)).toBe(true);
      expect(statsItem1.same(statsItem2)).toBe(false);
      expect(statsItem1.same(statsItem3)).toBe(false);
      expect(statsItem1.same(statsItem4)).toBe(false);
      expect(statsItem1.same(statsItem5)).toBe(false);
      expect(statsItem1.same(statsItem6)).toBe(true);
    });
  });
});
