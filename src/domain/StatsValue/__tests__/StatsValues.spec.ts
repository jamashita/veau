import { ImmutableProject } from '@jamashita/lluvia-project';
import { AsOf } from '../../AsOf/AsOf';
import { AsOfs } from '../../AsOf/AsOfs';
import { MockAsOf } from '../../AsOf/mock/MockAsOf';
import { NumericalValue } from '../../NumericalValue/NumericalValue';
import { MockStatsValue } from '../mock/MockStatsValue';
import { StatsValue, StatsValueJSON, StatsValueRow } from '../StatsValue';
import { StatsValueError } from '../StatsValueError';
import { StatsValues } from '../StatsValues';

describe('StatsValues', () => {
  describe('of', () => {
    it('when the ImmutableSequence is zero size, returns StatsValues.empty()', () => {
      const values: StatsValues = StatsValues.of(ImmutableProject.empty());

      expect(values).toBe(StatsValues.empty());
    });

    it('produces the instance', () => {
      const value1: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        })
      });
      const value2: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 3
        })
      });
      const vals: ImmutableProject<MockAsOf, MockStatsValue> = ImmutableProject.ofMap(
        new Map<MockAsOf, StatsValue>([
          [value1.getAsOf(), value1],
          [value2.getAsOf(), value2]
        ])
      );

      const values: StatsValues = StatsValues.of(vals);

      expect(values.size()).toBe(vals.size());
      expect(values.contains(value1)).toBe(true);
      expect(values.contains(value2)).toBe(true);
    });
  });

  describe('ofJSON', () => {
    it('when empty Array given, returns StatsValues.empty()', () => {
      const statsValues: StatsValues = StatsValues.ofJSON([]);

      expect(statsValues).toBe(StatsValues.empty());
    });

    it('normal case', () => {
      const json: Array<StatsValueJSON> = [
        {
          asOf: '2000-01-01',
          value: 1
        },
        {
          asOf: '2000-01-02',
          value: 2
        }
      ];
      const statsValue1: StatsValue = StatsValue.of(AsOf.ofString('2000-01-01'), NumericalValue.of(1));
      const statsValue2: StatsValue = StatsValue.of(AsOf.ofString('2000-01-02'), NumericalValue.of(2));

      const statsValues: StatsValues = StatsValues.ofJSON(json);

      expect(statsValues.size()).toBe(json.length);
      expect(statsValues.contains(statsValue1)).toBe(true);
      expect(statsValues.contains(statsValue2)).toBe(true);
    });

    it('contains mal format asOf', () => {
      const json: Array<StatsValueJSON> = [
        {
          asOf: '2000-01-01 00:00:00',
          value: 1
        },
        {
          asOf: '2000-01-02',
          value: 2
        }
      ];

      expect(() => {
        StatsValues.ofJSON(json);
      }).toThrow(StatsValueError);
    });

    it('will be multiple mal format asOfs', () => {
      const json: Array<StatsValueJSON> = [
        {
          asOf: '2000-01-01 00:00:00',
          value: 1
        },
        {
          asOf: '2000-01-02 00:00:00',
          value: 2
        }
      ];

      expect(() => {
        StatsValues.ofJSON(json);
      }).toThrow(StatsValueError);
    });
  });

  describe('ofRow', () => {
    it('when empty Array given, returns StatsValues.empty()', () => {
      const statsValues: StatsValues = StatsValues.ofRow([]);

      expect(statsValues).toBe(StatsValues.empty());
    });

    it('normal case', () => {
      const row: Array<StatsValueRow> = [
        {
          statsItemID: 'f186dad1-6170-4fdc-9020-d73d9bf86fb0',
          asOf: '2000-01-01',
          value: 1
        },
        {
          statsItemID: 'f186dad1-6170-4fdc-9020-d73d9bf86fb0',
          asOf: '2000-01-02',
          value: 2
        }
      ];
      const statsValue1: StatsValue = StatsValue.of(AsOf.ofString('2000-01-01'), NumericalValue.of(1));
      const statsValue2: StatsValue = StatsValue.of(AsOf.ofString('2000-01-02'), NumericalValue.of(2));

      const statsValues: StatsValues = StatsValues.ofRow(row);

      expect(statsValues.size()).toBe(row.length);
      expect(statsValues.contains(statsValue1)).toBe(true);
      expect(statsValues.contains(statsValue2)).toBe(true);
    });

    it('contains mal format statsItemID', () => {
      const row: Array<StatsValueRow> = [
        {
          statsItemID: 'illegal uuid',
          asOf: '2000-01-01',
          value: 1
        },
        {
          statsItemID: 'f186dad1-6170-4fdc-9020-d73d9bf86fb0',
          asOf: '2000-01-02',
          value: 2
        }
      ];

      const statsValues: StatsValues = StatsValues.ofRow(row);

      expect(statsValues.size()).toBe(row.length);
    });

    it('contains mal format asOf', () => {
      const row: Array<StatsValueRow> = [
        {
          statsItemID: 'f186dad1-6170-4fdc-9020-d73d9bf86fb0',
          asOf: '2000-01-01',
          value: 1
        },
        {
          statsItemID: 'f186dad1-6170-4fdc-9020-d73d9bf86fb0',
          asOf: '2000-01-02 00:00:00',
          value: 2
        }
      ];

      expect(() => {
        StatsValues.ofRow(row);
      }).toThrow(StatsValueError);
    });
  });

  describe('ofArray', () => {
    it('when empty Array given, returns StatsValues.empty()', () => {
      const statsValues: StatsValues = StatsValues.ofArray([]);

      expect(statsValues).toBe(StatsValues.empty());
    });

    it('normal case', () => {
      const statsValue1: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        })
      });
      const statsValue2: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 3
        })
      });
      const values: Array<MockStatsValue> = [statsValue1, statsValue2];

      const statsValues: StatsValues = StatsValues.ofArray(values);

      expect(statsValues.size()).toBe(values.length);
      expect(statsValues.contains(statsValue1)).toBe(true);
      expect(statsValues.contains(statsValue2)).toBe(true);
    });
  });

  describe('ofSpread', () => {
    it('when no arguments given, returns StatsValues.empty()', () => {
      const statsValues: StatsValues = StatsValues.ofSpread();

      expect(statsValues).toBe(StatsValues.empty());
    });

    it('normal case', () => {
      const statsValue1: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        })
      });
      const statsValue2: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 3
        })
      });

      const statsValues: StatsValues = StatsValues.ofSpread(statsValue1, statsValue2);

      expect(statsValues.size()).toBe(2);
      expect(statsValues.contains(statsValue1)).toBe(true);
      expect(statsValues.contains(statsValue2)).toBe(true);
    });
  });

  describe('validate', () => {
    it('normal case', () => {
      const n: unknown = [
        {
          asOf: '2000-01-01',
          value: 1
        },
        {
          asOf: '2000-01-02',
          value: 2
        },
        {
          asOf: '2000-01-03',
          value: 3
        }
      ];

      expect(StatsValues.validate(n)).toBe(true);
    });

    it('returns false because given parameter is not an object', () => {
      expect(StatsValues.validate(null)).toBe(false);
      expect(StatsValues.validate(undefined)).toBe(false);
      expect(StatsValues.validate(56)).toBe(false);
      expect(StatsValues.validate('fjafsd')).toBe(false);
      expect(StatsValues.validate(false)).toBe(false);
    });

    it('returns false because given parameter is not an array', () => {
      expect(StatsValues.validate({})).toBe(false);
    });

    it('returns false because the first element would not be StatsValueJSON', () => {
      const n: unknown = [
        {
          asOf: '2000-01-01',
          value: true
        },
        {
          asOf: '2000-01-02',
          value: 2
        },
        {
          asOf: '2000-01-03',
          value: 3
        }
      ];

      expect(StatsValues.validate(n)).toBe(false);
    });

    it('returns false because the second element would not be StatsValueJSON', () => {
      const n: unknown = [
        {
          asOf: '2000-01-01',
          value: 1
        },
        {
          asOf: false,
          value: 2
        },
        {
          asOf: '2000-01-03',
          value: 3
        }
      ];

      expect(StatsValues.validate(n)).toBe(false);
    });

    it('returns false because the last element would not be StatsValueJSON', () => {
      const n: unknown = [
        {
          asOf: '2000-01-01',
          value: 1
        },
        {
          asOf: '2000-01-02',
          value: 2
        },
        {
          asOf: '2000-01-03',
          value: '20'
        }
      ];

      expect(StatsValues.validate(n)).toBe(false);
    });
  });

  describe('empty', () => {
    it('generates 0-length StatsValues', () => {
      expect(StatsValues.empty().size()).toBe(0);
    });

    it('returns singleton instance', () => {
      expect(StatsValues.empty()).toBe(StatsValues.empty());
    });
  });

  describe('get', () => {
    it('delegates its inner collection instance', () => {
      const statsValue1: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 1
        })
      });
      const statsValue2: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        })
      });
      const statsValue3: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 3
        })
      });

      const vals: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.ofMap(
        new Map([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const spy: jest.SpyInstance = jest.spyOn(vals, 'get');
      const values: StatsValues = StatsValues.of(vals);

      // @ts-expect-error
      values.vals = vals;
      values.get(new MockAsOf());

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('set', () => {
    it('cannot set the same object', () => {
      const statsValue1: StatsValue = new MockStatsValue({
        value: NumericalValue.of(1)
      });

      const statsValues: StatsValues = StatsValues.ofArray([statsValue1]);
      const statsValue: MockStatsValue = new MockStatsValue({
        value: NumericalValue.of(1)
      });

      const set: StatsValues = statsValues.set(statsValue);

      expect(set.size()).toBe(1);
      expect(set.contains(statsValue1)).toBe(true);
      expect(set.contains(statsValue)).toBe(true);
    });

    it('update pattern', () => {
      const statsValue1: StatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 1
        }),
        value: NumericalValue.of(1)
      });
      const statsValue2: StatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        }),
        value: NumericalValue.of(2)
      });
      const statsValue3: StatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 3
        }),
        value: NumericalValue.of(3)
      });

      const statsValues: StatsValues = StatsValues.ofArray([statsValue1, statsValue2, statsValue3]);
      const statsValue: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        }),
        value: NumericalValue.of(4)
      });

      const set: StatsValues = statsValues.set(statsValue);

      expect(set.size()).toBe(3);
      expect(set.contains(statsValue1)).toBe(true);
      expect(set.contains(statsValue2)).toBe(false);
      expect(set.contains(statsValue3)).toBe(true);
      expect(set.contains(statsValue)).toBe(true);
    });

    it('insert pattern', () => {
      const statsValue1: StatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 1
        }),
        value: NumericalValue.of(1)
      });
      const statsValue2: StatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 3
        }),
        value: NumericalValue.of(3)
      });

      const statsValues: StatsValues = StatsValues.ofArray([statsValue1, statsValue2]);
      const statsValue: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        }),
        value: NumericalValue.of(2)
      });

      const set: StatsValues = statsValues.set(statsValue);

      expect(set.size()).toBe(3);
      expect(set.contains(statsValue1)).toBe(true);
      expect(set.contains(statsValue2)).toBe(true);
      expect(set.contains(statsValue)).toBe(true);
    });
  });

  describe('delete', () => {
    it('deletes a element if its asOf is the same', () => {
      const statsValue1: StatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 1
        }),
        value: NumericalValue.of(1)
      });
      const statsValue2: StatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        }),
        value: NumericalValue.of(2)
      });
      const statsValue3: StatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 3
        }),
        value: NumericalValue.of(3)
      });

      const statsValues: StatsValues = StatsValues.ofArray([statsValue1, statsValue2, statsValue3]);
      const asOf: MockAsOf = new MockAsOf({
        day: 2
      });

      const deleted: StatsValues = statsValues.delete(asOf);

      expect(deleted.size()).toBe(2);
      expect(deleted.contains(statsValue1)).toBe(true);
      expect(deleted.contains(statsValue2)).toBe(false);
      expect(deleted.contains(statsValue3)).toBe(true);
    });

    it('returns StatsValues.empty() if the all values are deleted', () => {
      const asOf: MockAsOf = new MockAsOf({
        day: 10
      });
      const statsValues: StatsValues = StatsValues.ofArray([
        new MockStatsValue({
          asOf
        }),
        new MockStatsValue({
          asOf
        })
      ]);

      expect(statsValues.delete(asOf)).toBe(StatsValues.empty());
    });
  });

  describe('getAdOfs', () => {
    it('extracts only their asOfs', () => {
      const asOf1: MockAsOf = new MockAsOf({
        day: 3
      });
      const asOf2: MockAsOf = new MockAsOf({
        day: 5
      });
      const asOfs: AsOfs = AsOfs.ofSpread(asOf1, asOf2);

      const statsValues: StatsValues = StatsValues.ofArray([
        new MockStatsValue({
          asOf: asOf1
        }),
        new MockStatsValue({
          asOf: asOf2
        })
      ]);

      expect(statsValues.getAsOfs().size()).toBe(2);
      expect(statsValues.getAsOfs().equals(asOfs)).toBe(true);
    });
  });

  describe('contains', () => {
    it('delegates its inner collection instance', () => {
      const statsValue1: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 1
        })
      });
      const statsValue2: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        })
      });
      const statsValue3: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 3
        })
      });

      const vals: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.ofMap(
        new Map([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const spy: jest.SpyInstance = jest.spyOn(vals, 'contains');
      const values: StatsValues = StatsValues.of(vals);

      // @ts-expect-error
      values.vals = vals;
      values.contains(statsValue3);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('isEmpty', () => {
    it('delegates its inner collection instance', () => {
      const statsValue1: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 1
        })
      });
      const statsValue2: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        })
      });
      const statsValue3: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 3
        })
      });

      const vals: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.ofMap(
        new Map([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const spy: jest.SpyInstance = jest.spyOn(vals, 'isEmpty');
      const values: StatsValues = StatsValues.of(vals);

      // @ts-expect-error
      values.vals = vals;
      values.isEmpty();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('size', () => {
    it('delegates its inner collection instance', () => {
      const statsValue1: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 1
        })
      });
      const statsValue2: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        })
      });
      const statsValue3: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 3
        })
      });

      const vals: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.ofMap(
        new Map([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const spy: jest.SpyInstance = jest.spyOn(vals, 'size');
      const values: StatsValues = StatsValues.of(vals);

      // @ts-expect-error
      values.vals = vals;
      values.size();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('forEach', () => {
    it('delegates its inner collection instance', () => {
      const statsValue1: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 1
        })
      });
      const statsValue2: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        })
      });
      const statsValue3: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 3
        })
      });

      const vals: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.ofMap(
        new Map([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const spy: jest.SpyInstance = jest.spyOn(vals, 'forEach');
      const values: StatsValues = StatsValues.of(vals);

      // @ts-expect-error
      values.vals = vals;
      values.forEach(() => {
        // NOOP
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('duplicate', () => {
    it('just create a new array but the objects are the same', () => {
      const statsValue1: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        })
      });
      const statsValue2: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 3
        })
      });
      const statsValue3: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 4
        })
      });
      const statsValue4: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 5
        })
      });

      const statsValues: StatsValues = StatsValues.ofArray([statsValue1, statsValue2, statsValue3, statsValue4]);
      const duplicated: StatsValues = statsValues.duplicate();

      expect(statsValues).not.toBe(duplicated);
      expect(statsValues.size()).toBe(duplicated.size());
      expect(duplicated.contains(statsValue1)).toBe(true);
      expect(duplicated.contains(statsValue2)).toBe(true);
      expect(duplicated.contains(statsValue3)).toBe(true);
      expect(duplicated.contains(statsValue4)).toBe(true);
    });

    it('returns StatsValues.empty() if the original is empty', () => {
      expect(StatsValues.empty().duplicate()).toBe(StatsValues.empty());
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      const values: StatsValues = StatsValues.empty();

      expect(values.equals(null)).toBe(false);
      expect(values.equals(undefined)).toBe(false);
      expect(values.equals('')).toBe(false);
      expect(values.equals('123')).toBe(false);
      expect(values.equals('abcd')).toBe(false);
      expect(values.equals(123)).toBe(false);
      expect(values.equals(0)).toBe(false);
      expect(values.equals(-12)).toBe(false);
      expect(values.equals(0.3)).toBe(false);
      expect(values.equals(false)).toBe(false);
      expect(values.equals(true)).toBe(false);
      expect(values.equals(Symbol('p'))).toBe(false);
      expect(values.equals(20n)).toBe(false);
      expect(values.equals({})).toBe(false);
      expect(values.equals([])).toBe(false);
      expect(values.equals(Object.create(null))).toBe(false);
    });

    it('returns true when the same instance given', () => {
      const statsValue1: StatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        }),
        value: NumericalValue.of(1)
      });
      const statsValue2: StatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 3
        }),
        value: NumericalValue.of(2)
      });

      const statsValues: StatsValues = StatsValues.ofArray([statsValue1, statsValue2]);

      expect(statsValues.equals(statsValues)).toBe(true);
    });

    it('delegates its inner collection instance', () => {
      const statsValue1: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 1
        })
      });
      const statsValue2: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        })
      });
      const statsValue3: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 3
        })
      });

      const vals: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.ofMap(
        new Map([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const spy: jest.SpyInstance = jest.spyOn(vals, 'equals');
      const values: StatsValues = StatsValues.of(vals);

      // @ts-expect-error
      values.vals = vals;
      values.equals(StatsValues.empty());

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('iterator', () => {
    it('normal case', () => {
      const statsValue1: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 1
        })
      });
      const statsValue2: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        })
      });
      const statsValue3: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 3
        })
      });

      const arr: Array<MockStatsValue> = [statsValue1, statsValue2, statsValue3];

      const vals: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.ofMap(
        new Map([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const values: StatsValues = StatsValues.of(vals);
      let i: number = 0;

      for (const [, v] of values) {
        expect(v).toBe(arr[i]);
        i++;
      }
    });
  });

  describe('every', () => {
    it('delegates its inner collection instance', () => {
      const statsValue1: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 1
        })
      });
      const statsValue2: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        })
      });
      const statsValue3: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 3
        })
      });

      const vals: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.ofMap(
        new Map([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const spy: jest.SpyInstance = jest.spyOn(vals, 'every');
      const values: StatsValues = StatsValues.of(vals);

      // @ts-expect-error
      values.vals = vals;
      values.every(() => {
        return true;
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('some', () => {
    it('delegates its inner collection instance', () => {
      const statsValue1: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 1
        })
      });
      const statsValue2: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        })
      });
      const statsValue3: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 3
        })
      });

      const vals: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.ofMap(
        new Map([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const spy: jest.SpyInstance = jest.spyOn(vals, 'some');
      const values: StatsValues = StatsValues.of(vals);

      // @ts-expect-error
      values.vals = vals;
      values.some(() => {
        return true;
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('values', () => {
    it('delegates its inner collection instance', () => {
      const statsValue1: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 1
        })
      });
      const statsValue2: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        })
      });
      const statsValue3: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 3
        })
      });

      const vals: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.ofMap(
        new Map([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const spy: jest.SpyInstance = jest.spyOn(vals, 'values');
      const values: StatsValues = StatsValues.of(vals);

      // @ts-expect-error
      values.vals = vals;
      values.values();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('filter', () => {
    it('delegates its inner collection instance', () => {
      const statsValue1: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 1
        })
      });
      const statsValue2: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        })
      });
      const statsValue3: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 3
        })
      });

      const vals: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.ofMap(
        new Map([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const values: StatsValues = StatsValues.of(vals);

      const filtered: StatsValues = values.filter((v: StatsValue) => {
        return v.getAsOf().isAfter(AsOf.ofString('2000-01-01'));
      });

      expect(filtered.size()).toBe(2);
    });
  });

  describe('find', () => {
    it('delegates its inner collection instance', () => {
      const statsValue1: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 1
        })
      });
      const statsValue2: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        })
      });
      const statsValue3: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 3
        })
      });

      const vals: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.ofMap(
        new Map([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const spy: jest.SpyInstance = jest.spyOn(vals, 'find');
      const values: StatsValues = StatsValues.of(vals);

      // @ts-expect-error
      values.vals = vals;
      values.find(() => {
        return true;
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('map', () => {
    it('does not affect the original length', () => {
      const statsValue1: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 1
        })
      });
      const statsValue2: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        })
      });
      const statsValue3: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 3
        })
      });

      const vals: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.ofMap(
        new Map([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const values: StatsValues = StatsValues.of(vals);

      const mapped: ImmutableProject<AsOf, AsOf> = values.map((v: StatsValue): AsOf => {
        return v.getAsOf();
      });

      expect(mapped.size()).toBe(3);
    });
  });
});
