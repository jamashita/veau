import { ImmutableProject } from '@jamashita/publikum-collection';
import { Schrodinger, Superposition } from '@jamashita/publikum-monad';
import sinon, { SinonSpy } from 'sinon';

import { AsOf } from '../../AsOf/AsOf';
import { MockAsOf } from '../../AsOf/Mock/MockAsOf';
import { MockAsOfs } from '../../AsOf/Mock/MockAsOfs';
import { MockNumericalValue } from '../../NumericalValue/Mock/MockNumericalValue';
import { NumericalValue } from '../../NumericalValue/NumericalValue';
import { StatsValueError } from '../Error/StatsValueError';
import { StatsValuesError } from '../Error/StatsValuesError';
import { MockStatsValue } from '../Mock/MockStatsValue';
import { StatsValue, StatsValueJSON, StatsValueRow } from '../StatsValue';
import { StatsValues } from '../StatsValues';

describe('StatsValues', () => {
  describe('of', () => {
    it('when the ImmutableSequence is zero size, returns StatsValues.empty()', () => {
      const values: StatsValues = StatsValues.of(ImmutableProject.empty<AsOf, StatsValue>());

      expect(values).toBe(StatsValues.empty());
    });

    it('normal case', () => {
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
      const project: ImmutableProject<MockAsOf, MockStatsValue> = ImmutableProject.of<MockAsOf, StatsValue>(
        new Map<MockAsOf, StatsValue>([
          [value1.getAsOf(), value1],
          [value2.getAsOf(), value2]
        ])
      );

      const values: StatsValues = StatsValues.of(project);

      expect(values.size()).toBe(project.size());
      expect(values.contains(value1)).toBe(true);
      expect(values.contains(value2)).toBe(true);
    });
  });

  describe('ofSuperposition', () => {
    it('when empty Array given, returns Alive, and StatsValues.empty()', async () => {
      const superposition: Superposition<StatsValues, StatsValuesError> = StatsValues.ofSuperposition([]);
      const schrodinger: Schrodinger<StatsValues, StatsValuesError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(StatsValues.empty());
    });

    it('normal case', async () => {
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

      const superposition1: Superposition<StatsValue, StatsValueError> = Superposition.alive<StatsValue,
        StatsValueError>(statsValue1, StatsValueError);
      const superposition2: Superposition<StatsValue, StatsValueError> = Superposition.alive<StatsValue,
        StatsValueError>(statsValue2, StatsValueError);
      const superposition: Superposition<StatsValues, StatsValuesError> = StatsValues.ofSuperposition([
        superposition1,
        superposition2
      ]);
      const schrodinger: Schrodinger<StatsValues, StatsValuesError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const values: StatsValues = schrodinger.get();

      expect(values.size()).toBe(2);
      expect(values.contains(statsValue1)).toBe(true);
      expect(values.contains(statsValue2)).toBe(true);
      expect(values.contains(statsValue3)).toBe(false);
    });

    it('contains failure', async () => {
      const superposition1: Superposition<StatsValue, StatsValueError> = Superposition.alive<StatsValue,
        StatsValueError>(new MockStatsValue(), StatsValueError);
      const superposition2: Superposition<StatsValue, StatsValueError> = Superposition.dead<StatsValue,
        StatsValueError>(new StatsValueError('test failed'), StatsValueError);
      const superposition: Superposition<StatsValues, StatsValuesError> = StatsValues.ofSuperposition([
        superposition1,
        superposition2
      ]);
      const schrodinger: Schrodinger<StatsValues, StatsValuesError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsValuesError);
    });

    it('will be multiple failures', async () => {
      const superposition1: Superposition<StatsValue, StatsValueError> = Superposition.dead<StatsValue,
        StatsValueError>(new StatsValueError('test failed1'), StatsValueError);
      const superposition2: Superposition<StatsValue, StatsValueError> = Superposition.dead<StatsValue,
        StatsValueError>(new StatsValueError('test failed2'), StatsValueError);
      const superposition: Superposition<StatsValues, StatsValuesError> = StatsValues.ofSuperposition([
        superposition1,
        superposition2
      ]);
      const schrodinger: Schrodinger<StatsValues, StatsValuesError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsValuesError);
    });
  });

  describe('ofJSON', () => {
    it('when empty Array given, returns StatsValues.empty()', async () => {
      const superposition: Superposition<StatsValues, StatsValuesError> = StatsValues.ofJSON([]);
      const schrodinger: Schrodinger<StatsValues, StatsValuesError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(StatsValues.empty());
    });

    it('normal case', async () => {
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
      const statsValue1: StatsValue = StatsValue.of(await AsOf.ofString('2000-01-01').get(), NumericalValue.of(1));
      const statsValue2: StatsValue = StatsValue.of(await AsOf.ofString('2000-01-02').get(), NumericalValue.of(2));

      const superposition: Superposition<StatsValues, StatsValuesError> = StatsValues.ofJSON(json);
      const schrodinger: Schrodinger<StatsValues, StatsValuesError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const values: StatsValues = schrodinger.get();

      expect(values.size()).toBe(json.length);
      expect(values.contains(statsValue1)).toBe(true);
      expect(values.contains(statsValue2)).toBe(true);
    });

    it('contains malformat asOf', async () => {
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

      const superposition: Superposition<StatsValues, StatsValuesError> = StatsValues.ofJSON(json);
      const schrodinger: Schrodinger<StatsValues, StatsValuesError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsValuesError);
    });

    it('will be multiple malformat asOfs', async () => {
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

      const superposition: Superposition<StatsValues, StatsValuesError> = StatsValues.ofJSON(json);
      const schrodinger: Schrodinger<StatsValues, StatsValuesError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsValuesError);
    });
  });

  describe('ofRow', () => {
    it('when empty Array given, returns StatsValues.empty()', async () => {
      const superposition: Superposition<StatsValues, StatsValuesError> = StatsValues.ofRow([]);
      const schrodinger: Schrodinger<StatsValues, StatsValuesError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(StatsValues.empty());
    });

    it('normal case', async () => {
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
      const statsValue1: StatsValue = StatsValue.of(await AsOf.ofString('2000-01-01').get(), NumericalValue.of(1));
      const statsValue2: StatsValue = StatsValue.of(await AsOf.ofString('2000-01-02').get(), NumericalValue.of(2));

      const superposition: Superposition<StatsValues, StatsValuesError> = StatsValues.ofRow(row);
      const schrodinger: Schrodinger<StatsValues, StatsValuesError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const values: StatsValues = schrodinger.get();

      expect(values.size()).toBe(row.length);
      expect(values.contains(statsValue1)).toBe(true);
      expect(values.contains(statsValue2)).toBe(true);
    });

    it('contains malformat statsItemID', async () => {
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

      const superposition: Superposition<StatsValues, StatsValuesError> = StatsValues.ofRow(row);
      const schrodinger: Schrodinger<StatsValues, StatsValuesError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
    });

    it('contains malformat asOf', async () => {
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

      const superposition: Superposition<StatsValues, StatsValuesError> = StatsValues.ofRow(row);
      const schrodinger: Schrodinger<StatsValues, StatsValuesError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsValuesError);
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

  describe('isJSON', () => {
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

      expect(StatsValues.isJSON(n)).toBe(true);
    });

    it('returns false because given parameter is not an object', () => {
      expect(StatsValues.isJSON(null)).toBe(false);
      expect(StatsValues.isJSON(undefined)).toBe(false);
      expect(StatsValues.isJSON(56)).toBe(false);
      expect(StatsValues.isJSON('fjafsd')).toBe(false);
      expect(StatsValues.isJSON(false)).toBe(false);
    });

    it('returns false because given parameter is not an array', () => {
      expect(StatsValues.isJSON({})).toBe(false);
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

      expect(StatsValues.isJSON(n)).toBe(false);
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

      expect(StatsValues.isJSON(n)).toBe(false);
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

      expect(StatsValues.isJSON(n)).toBe(false);
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
    it('delegates its inner collection instance', async () => {
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

      const project: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.of<AsOf, MockStatsValue>(
        new Map<AsOf, MockStatsValue>([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.get = spy;

      const values: StatsValues = StatsValues.of(project);

      values.get(new MockAsOf());

      expect(spy.called).toBe(true);
    });
  });

  describe('set', () => {
    it('cannot set the same object', () => {
      const statsValue1: StatsValue = new MockStatsValue({
        value: new MockNumericalValue(1)
      });

      const statsValues: StatsValues = StatsValues.ofArray([statsValue1]);
      const statsValue: MockStatsValue = new MockStatsValue({
        value: new MockNumericalValue(1)
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
        value: new MockNumericalValue(1)
      });
      const statsValue2: StatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        }),
        value: new MockNumericalValue(2)
      });
      const statsValue3: StatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 3
        }),
        value: new MockNumericalValue(3)
      });

      const statsValues: StatsValues = StatsValues.ofArray([statsValue1, statsValue2, statsValue3]);
      const statsValue: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        }),
        value: new MockNumericalValue(4)
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
        value: new MockNumericalValue(1)
      });
      const statsValue2: StatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 3
        }),
        value: new MockNumericalValue(3)
      });

      const statsValues: StatsValues = StatsValues.ofArray([statsValue1, statsValue2]);
      const statsValue: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        }),
        value: new MockNumericalValue(2)
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
        value: new MockNumericalValue(1)
      });
      const statsValue2: StatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        }),
        value: new MockNumericalValue(2)
      });
      const statsValue3: StatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 3
        }),
        value: new MockNumericalValue(3)
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
    it('delegates its inner collection instance', async () => {
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

      const project: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.of<AsOf, MockStatsValue>(
        new Map<AsOf, MockStatsValue>([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.contains = spy;

      const values: StatsValues = StatsValues.of(project);

      values.contains(statsValue3);

      expect(spy.called).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('delegates its inner collection instance', async () => {
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

      const project: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.of<AsOf, MockStatsValue>(
        new Map<AsOf, MockStatsValue>([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.isEmpty = spy;

      const values: StatsValues = StatsValues.of(project);

      values.isEmpty();

      expect(spy.called).toBe(true);
    });
  });

  describe('size', () => {
    it('delegates its inner collection instance', async () => {
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

      const project: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.of<AsOf, MockStatsValue>(
        new Map<AsOf, MockStatsValue>([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.size = spy;

      const values: StatsValues = StatsValues.of(project);

      values.size();

      expect(spy.called).toBe(true);
    });
  });

  describe('forEach', () => {
    it('delegates its inner collection instance', async () => {
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

      const project: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.of<AsOf, MockStatsValue>(
        new Map<AsOf, MockStatsValue>([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.forEach = spy;

      const values: StatsValues = StatsValues.of(project);

      values.forEach(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
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
    it('same instance', () => {
      const statsValue1: StatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        }),
        value: new MockNumericalValue(1)
      });
      const statsValue2: StatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 3
        }),
        value: new MockNumericalValue(2)
      });

      const statsValues: StatsValues = StatsValues.ofArray([statsValue1, statsValue2]);

      expect(statsValues.equals(statsValues)).toBe(true);
    });

    it('delegates its inner collection instance', async () => {
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

      const project: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.of<AsOf, MockStatsValue>(
        new Map<AsOf, MockStatsValue>([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.equals = spy;

      const values: StatsValues = StatsValues.of(project);

      values.equals(StatsValues.empty());

      expect(spy.called).toBe(true);
    });
  });

  describe('toString', () => {
    it('normal case', async () => {
      const asOf1: string = '2000-01-01';
      const asOf2: string = '2000-01-02';
      const value1: number = 1;
      const value2: number = 2;

      const statsValues: StatsValues = StatsValues.ofArray([
        StatsValue.of(await AsOf.ofString(asOf1).get(), NumericalValue.of(value1)),
        StatsValue.of(await AsOf.ofString(asOf2).get(), NumericalValue.of(value2))
      ]);

      expect(statsValues.toString()).toBe(`${asOf1} ${value1}, ${asOf2} ${value2}`);
    });
  });

  describe('iterator', () => {
    it('normal case', async () => {
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

      const project: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.of<AsOf, MockStatsValue>(
        new Map<AsOf, MockStatsValue>([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const values: StatsValues = StatsValues.of(project);

      let i: number = 0;

      for (const pair of values) {
        expect(pair.getValue()).toBe(arr[i]);
        i++;
      }
    });
  });

  describe('every', () => {
    it('delegates its inner collection instance', async () => {
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

      const project: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.of<AsOf, MockStatsValue>(
        new Map<AsOf, MockStatsValue>([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.every = spy;

      const values: StatsValues = StatsValues.of(project);

      values.every(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('some', () => {
    it('delegates its inner collection instance', async () => {
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

      const project: ImmutableProject<AsOf, MockStatsValue> = ImmutableProject.of<AsOf, MockStatsValue>(
        new Map<AsOf, MockStatsValue>([
          [statsValue1.getAsOf(), statsValue1],
          [statsValue2.getAsOf(), statsValue2],
          [statsValue3.getAsOf(), statsValue3]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.some = spy;

      const values: StatsValues = StatsValues.of(project);

      values.some(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });
});
