import { ImmutableProject } from '@jamashita/lluvia-collection';
import sinon, { SinonSpy } from 'sinon';
import { AsOf } from '../../AsOf/AsOf';
import { MockAsOf } from '../../AsOf/Mock/MockAsOf';
import { MockAsOfs } from '../../AsOf/Mock/MockAsOfs';
import { ValueContained } from '../../NumericalValue/ValueContained';
import { StatsValueError } from '../Error/StatsValueError';
import { MockStatsValue } from '../Mock/MockStatsValue';
import { StatsValue, StatsValueJSON, StatsValueRow } from '../StatsValue';
import { StatsValues } from '../StatsValues';

describe('StatsValues', () => {
  describe('of', () => {
    it('when the ImmutableSequence is zero size, returns StatsValues.empty()', () => {
      expect.assertions(1);

      const values: StatsValues = StatsValues.of(ImmutableProject.empty<AsOf, StatsValue>());

      expect(values).toBe(StatsValues.empty());
    });

    it('produces the instance', () => {
      expect.assertions(3);

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
      const vals: ImmutableProject<MockAsOf, MockStatsValue> = ImmutableProject.ofMap<MockAsOf, StatsValue>(
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
      expect.assertions(1);

      const statsValues: StatsValues = StatsValues.ofJSON([]);

      expect(statsValues).toBe(StatsValues.empty());
    });

    it('normal case', () => {
      expect.assertions(3);

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
      const statsValue1: StatsValue = StatsValue.of(AsOf.ofString('2000-01-01'), ValueContained.of(1));
      const statsValue2: StatsValue = StatsValue.of(AsOf.ofString('2000-01-02'), ValueContained.of(2));

      const statsValues: StatsValues = StatsValues.ofJSON(json);

      expect(statsValues.size()).toBe(json.length);
      expect(statsValues.contains(statsValue1)).toBe(true);
      expect(statsValues.contains(statsValue2)).toBe(true);
    });

    it('contains mal format asOf', () => {
      expect.assertions(1);

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
      expect.assertions(1);

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
      expect.assertions(1);

      const statsValues: StatsValues = StatsValues.ofRow([]);

      expect(statsValues).toBe(StatsValues.empty());
    });

    it('normal case', () => {
      expect.assertions(3);

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
      const statsValue1: StatsValue = StatsValue.of(AsOf.ofString('2000-01-01'), ValueContained.of(1));
      const statsValue2: StatsValue = StatsValue.of(AsOf.ofString('2000-01-02'), ValueContained.of(2));

      const statsValues: StatsValues = StatsValues.ofRow(row);

      expect(statsValues.size()).toBe(row.length);
      expect(statsValues.contains(statsValue1)).toBe(true);
      expect(statsValues.contains(statsValue2)).toBe(true);
    });

    it('contains mal format statsItemID', () => {
      expect.assertions(1);

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
      expect.assertions(1);

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
      expect.assertions(1);

      const statsValues: StatsValues = StatsValues.ofArray([]);

      expect(statsValues).toBe(StatsValues.empty());
    });

    it('normal case', () => {
      expect.assertions(3);

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
      expect.assertions(1);

      const statsValues: StatsValues = StatsValues.ofSpread();

      expect(statsValues).toBe(StatsValues.empty());
    });

    it('normal case', () => {
      expect.assertions(3);

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
      expect.assertions(1);

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
      expect.assertions(5);

      expect(StatsValues.validate(null)).toBe(false);
      expect(StatsValues.validate(undefined)).toBe(false);
      expect(StatsValues.validate(56)).toBe(false);
      expect(StatsValues.validate('fjafsd')).toBe(false);
      expect(StatsValues.validate(false)).toBe(false);
    });

    it('returns false because given parameter is not an array', () => {
      expect.assertions(1);

      expect(StatsValues.validate({})).toBe(false);
    });

    it('returns false because the first element would not be StatsValueJSON', () => {
      expect.assertions(1);

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
      expect.assertions(1);

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
      expect.assertions(1);

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
      expect.assertions(1);

      expect(StatsValues.empty().size()).toBe(0);
    });

    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(StatsValues.empty()).toBe(StatsValues.empty());
    });
  });

  describe('get', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

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

      const vals: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.ofMap<AsOf, MockStatsValue>(
        new Map<AsOf, MockStatsValue>([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      vals.get = spy;

      const values: StatsValues = StatsValues.of(vals);
      // @ts-expect-error
      values.vals = vals;

      values.get(new MockAsOf());

      expect(spy.called).toBe(true);
    });
  });

  describe('set', () => {
    it('cannot set the same object', () => {
      expect.assertions(3);

      const statsValue1: StatsValue = new MockStatsValue({
        value: ValueContained.of(1)
      });

      const statsValues: StatsValues = StatsValues.ofArray([statsValue1]);
      const statsValue: MockStatsValue = new MockStatsValue({
        value: ValueContained.of(1)
      });

      const set: StatsValues = statsValues.set(statsValue);

      expect(set.size()).toBe(1);
      expect(set.contains(statsValue1)).toBe(true);
      expect(set.contains(statsValue)).toBe(true);
    });

    it('update pattern', () => {
      expect.assertions(5);

      const statsValue1: StatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 1
        }),
        value: ValueContained.of(1)
      });
      const statsValue2: StatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        }),
        value: ValueContained.of(2)
      });
      const statsValue3: StatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 3
        }),
        value: ValueContained.of(3)
      });

      const statsValues: StatsValues = StatsValues.ofArray([statsValue1, statsValue2, statsValue3]);
      const statsValue: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        }),
        value: ValueContained.of(4)
      });

      const set: StatsValues = statsValues.set(statsValue);

      expect(set.size()).toBe(3);
      expect(set.contains(statsValue1)).toBe(true);
      expect(set.contains(statsValue2)).toBe(false);
      expect(set.contains(statsValue3)).toBe(true);
      expect(set.contains(statsValue)).toBe(true);
    });

    it('insert pattern', () => {
      expect.assertions(4);

      const statsValue1: StatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 1
        }),
        value: ValueContained.of(1)
      });
      const statsValue2: StatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 3
        }),
        value: ValueContained.of(3)
      });

      const statsValues: StatsValues = StatsValues.ofArray([statsValue1, statsValue2]);
      const statsValue: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        }),
        value: ValueContained.of(2)
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
      expect.assertions(4);

      const statsValue1: StatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 1
        }),
        value: ValueContained.of(1)
      });
      const statsValue2: StatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        }),
        value: ValueContained.of(2)
      });
      const statsValue3: StatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 3
        }),
        value: ValueContained.of(3)
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
      expect.assertions(1);

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
      expect.assertions(2);

      const asOf1: MockAsOf = new MockAsOf({
        day: 3
      });
      const asOf2: MockAsOf = new MockAsOf({
        day: 5
      });
      const asOfs: MockAsOfs = new MockAsOfs(asOf1, asOf2);

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
      expect.assertions(1);

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

      const vals: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.ofMap<AsOf, MockStatsValue>(
        new Map<AsOf, MockStatsValue>([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      vals.contains = spy;

      const values: StatsValues = StatsValues.of(vals);
      // @ts-expect-error
      values.vals = vals;

      values.contains(statsValue3);

      expect(spy.called).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

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

      const vals: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.ofMap<AsOf, MockStatsValue>(
        new Map<AsOf, MockStatsValue>([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      vals.isEmpty = spy;

      const values: StatsValues = StatsValues.of(vals);
      // @ts-expect-error
      values.vals = vals;

      values.isEmpty();

      expect(spy.called).toBe(true);
    });
  });

  describe('size', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

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

      const vals: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.ofMap<AsOf, MockStatsValue>(
        new Map<AsOf, MockStatsValue>([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      vals.size = spy;

      const values: StatsValues = StatsValues.of(vals);
      // @ts-expect-error
      values.vals = vals;

      values.size();

      expect(spy.called).toBe(true);
    });
  });

  describe('forEach', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

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

      const vals: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.ofMap<AsOf, MockStatsValue>(
        new Map<AsOf, MockStatsValue>([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      vals.forEach = spy;

      const values: StatsValues = StatsValues.of(vals);
      // @ts-expect-error
      values.vals = vals;

      values.forEach(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('duplicate', () => {
    it('just create a new array but the objects are the same', () => {
      expect.assertions(6);

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
      expect.assertions(1);

      expect(StatsValues.empty().duplicate()).toBe(StatsValues.empty());
    });
  });

  describe('equals', () => {
    it('returns true when the same instance given', () => {
      expect.assertions(1);

      const statsValue1: StatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        }),
        value: ValueContained.of(1)
      });
      const statsValue2: StatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 3
        }),
        value: ValueContained.of(2)
      });

      const statsValues: StatsValues = StatsValues.ofArray([statsValue1, statsValue2]);

      expect(statsValues.equals(statsValues)).toBe(true);
    });

    it('delegates its inner collection instance', () => {
      expect.assertions(1);

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

      const vals: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.ofMap<AsOf, MockStatsValue>(
        new Map<AsOf, MockStatsValue>([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      vals.equals = spy;

      const values: StatsValues = StatsValues.of(vals);
      // @ts-expect-error
      values.vals = vals;

      values.equals(StatsValues.empty());

      expect(spy.called).toBe(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      expect.assertions(1);

      const asOf1: string = '2000-01-01';
      const asOf2: string = '2000-01-02';
      const value1: number = 1;
      const value2: number = 2;

      const statsValues: StatsValues = StatsValues.ofArray([
        StatsValue.of(AsOf.ofString(asOf1), ValueContained.of(value1)),
        StatsValue.of(AsOf.ofString(asOf2), ValueContained.of(value2))
      ]);

      expect(statsValues.toString()).toBe(`${asOf1} ${value1}, ${asOf2} ${value2}`);
    });
  });

  describe('iterator', () => {
    it('normal case', () => {
      expect.assertions(3);

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

      const vals: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.ofMap<AsOf, MockStatsValue>(
        new Map<AsOf, MockStatsValue>([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const values: StatsValues = StatsValues.of(vals);

      let i: number = 0;

      values.forEach((v: StatsValue) => {
        expect(v).toBe(arr[i]);
        i++;
      });
    });
  });

  describe('every', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

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

      const vals: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.ofMap<AsOf, MockStatsValue>(
        new Map<AsOf, MockStatsValue>([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      vals.every = spy;

      const values: StatsValues = StatsValues.of(vals);
      // @ts-expect-error
      values.vals = vals;

      values.every(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('some', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

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

      const vals: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.ofMap<AsOf, MockStatsValue>(
        new Map<AsOf, MockStatsValue>([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      vals.some = spy;

      const values: StatsValues = StatsValues.of(vals);
      // @ts-expect-error
      values.vals = vals;

      values.some(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('values', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

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

      const vals: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.ofMap<AsOf, MockStatsValue>(
        new Map<AsOf, MockStatsValue>([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      vals.values = spy;

      const values: StatsValues = StatsValues.of(vals);
      // @ts-expect-error
      values.vals = vals;

      values.values();

      expect(spy.called).toBe(true);
    });
  });
});
