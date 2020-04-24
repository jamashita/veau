import { Absent, Alive, Dead, ImmutableSequence, Superposition, UUID } from 'publikum';
import sinon, { SinonSpy } from 'sinon';
import { StatsValueError } from '../../Error/StatsValueError';
import { StatsValuesError } from '../../Error/StatsValuesError';
import { AsOf } from '../AsOf';
import { MockAsOf } from '../Mock/MockAsOf';
import { MockAsOfs } from '../Mock/MockAsOfs';
import { MockNumericalValue } from '../Mock/MockNumericalValue';
import { MockNumericalValues } from '../Mock/MockNumericalValues';
import { MockStatsItemID } from '../Mock/MockStatsItemID';
import { MockStatsValue } from '../Mock/MockStatsValue';
import { NumericalValue } from '../NumericalValue';
import { StatsItemID } from '../StatsItemID';
import { StatsValue, StatsValueJSON, StatsValueRow } from '../StatsValue';
import { StatsValues } from '../StatsValues';

describe('StatsValues', () => {
  describe('of', () => {
    it('when the ImmutableSequence is zero size, returns StatsValues.empty()', () => {
      const values: StatsValues = StatsValues.of(ImmutableSequence.empty<StatsValue>());

      expect(values).toBe(StatsValues.empty());
    });

    it('normal case', () => {
      const value1: MockStatsValue = new MockStatsValue();
      const value2: MockStatsValue = new MockStatsValue();
      const sequence: ImmutableSequence<MockStatsValue> = ImmutableSequence.of<StatsValue>([
        value1,
        value2
      ]);

      const values: StatsValues = StatsValues.of(sequence);

      expect(values.size()).toBe(sequence.size());
      for (let i: number = 0; i < values.size(); i++) {
        expect(values.get(i).get()).toBe(sequence.get(i).get());
      }
    });
  });

  describe('ofSuperposition', () => {
    it('when empty Array given, returns Alive, and StatsValues.empty()', () => {
      const superposition: Superposition<StatsValues, StatsValuesError> = StatsValues.ofSuperposition([]);

      expect(superposition.isAlive()).toBe(true);
      expect(superposition.get()).toBe(StatsValues.empty());
    });

    it('normal case', () => {
      const statsValue1: MockStatsValue = new MockStatsValue();
      const statsValue2: MockStatsValue = new MockStatsValue();

      const superposition1: Superposition<StatsValue, StatsValueError> = Alive.of<StatsValue, StatsValueError>(statsValue1);
      const superposition2: Superposition<StatsValue, StatsValueError> = Alive.of<StatsValue, StatsValueError>(statsValue2);
      const superposition: Superposition<StatsValues, StatsValuesError> = StatsValues.ofSuperposition([
        superposition1,
        superposition2
      ]);

      expect(superposition.isAlive()).toBe(true);
      const values: StatsValues = superposition.get();
      expect(values.size()).toBe(2);
      expect(values.get(0).get()).toBe(statsValue1);
      expect(values.get(1).get()).toBe(statsValue2);
    });

    it('contains failure', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition1: Superposition<StatsValue, StatsValueError> = Alive.of<StatsValue, StatsValueError>(
        new MockStatsValue()
      );
      const superposition2: Superposition<StatsValue, StatsValueError> = Dead.of<StatsValue, StatsValueError>(
        new StatsValueError('test failed')
      );
      const superposition: Superposition<StatsValues, StatsValuesError> = StatsValues.ofSuperposition([
        superposition1,
        superposition2
      ]);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsValuesError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsValuesError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('will be multiple failures', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition1: Superposition<StatsValue, StatsValueError> = Dead.of<StatsValue, StatsValueError>(
        new StatsValueError('test failed1')
      );
      const superposition2: Superposition<StatsValue, StatsValueError> = Dead.of<StatsValue, StatsValueError>(
        new StatsValueError('test failed2')
      );
      const superposition: Superposition<StatsValues, StatsValuesError> = StatsValues.ofSuperposition([
        superposition1,
        superposition2
      ]);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsValuesError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsValuesError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('ofJSON', () => {
    it('when empty Array given, returns StatsValues.empty()', () => {
      const superpositions: Superposition<StatsValues, StatsValuesError> = StatsValues.ofJSON(
        new MockStatsItemID(),
        []
      );

      expect(superpositions.isAlive()).toBe(true);
      expect(superpositions.get()).toBe(StatsValues.empty());
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
      const statsItemID: MockStatsItemID = new MockStatsItemID();

      const superposition: Superposition<StatsValues, StatsValuesError> = StatsValues.ofJSON(
        statsItemID,
        json
      );

      expect(superposition.isAlive()).toBe(true);
      const values: StatsValues = superposition.get();
      expect(values.size()).toBe(json.length);
      for (let i: number = 0; i < values.size(); i++) {
        const value: StatsValue = values.get(i).get();
        expect(value.getStatsItemID()).toBe(statsItemID);
        expect(value.getAsOf().toString()).toBe(json[i].asOf);
        expect(value.getValue().get()).toBe(json[i].value);
      }
    });

    it('contains malformat asOf', () => {
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

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<StatsValues, StatsValuesError> = StatsValues.ofJSON(
        new MockStatsItemID(),
        json
      );

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsValuesError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsValuesError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('will be multiple malformat asOfs', () => {
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

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<StatsValues, StatsValuesError> = StatsValues.ofJSON(
        new MockStatsItemID(),
        json
      );

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsValuesError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsValuesError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('ofRow', () => {
    it('when empty Array given, returns StatsValues.empty()', () => {
      const superpositions: Superposition<StatsValues, StatsValuesError> = StatsValues.ofRow([]);

      expect(superpositions.isAlive()).toBe(true);
      expect(superpositions.get()).toBe(StatsValues.empty());
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

      const superposition: Superposition<StatsValues, StatsValuesError> = StatsValues.ofRow(row);

      expect(superposition.isAlive()).toBe(true);
      const values: StatsValues = superposition.get();
      expect(values.size()).toBe(row.length);
      for (let i: number = 0; i < values.size(); i++) {
        const value: StatsValue = values.get(i).get();
        expect(value.getStatsItemID().get().get()).toBe(row[i].statsItemID);
        expect(value.getAsOf().toString()).toBe(row[i].asOf);
        expect(value.getValue().get()).toBe(row[i].value);
      }
    });

    it('contains malformat statsItemID', () => {
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

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<StatsValues, StatsValuesError> = StatsValues.ofRow(row);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsValuesError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsValuesError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('contains malformat asOf', () => {
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

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<StatsValues, StatsValuesError> = StatsValues.ofRow(row);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsValuesError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsValuesError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('ofArray', () => {
    it('when empty Array given, returns StatsValues.empty()', () => {
      const statsValues: StatsValues = StatsValues.ofArray([]);

      expect(statsValues).toBe(StatsValues.empty());
    });

    it('normal case', () => {
      const statsValue1: MockStatsValue = new MockStatsValue();
      const statsValue2: MockStatsValue = new MockStatsValue();
      const values: Array<MockStatsValue> = [
        statsValue1,
        statsValue2
      ];

      const statsValues: StatsValues = StatsValues.ofArray(values);

      expect(statsValues.size()).toBe(values.length);
      for (let i: number = 0; i < statsValues.size(); i++) {
        expect(statsValues.get(i).get()).toBe(values[i]);
      }
    });
  });

  describe('ofSpread', () => {
    it('when no arguments given, returns StatsValues.empty()', () => {
      const statsValues: StatsValues = StatsValues.ofSpread();

      expect(statsValues).toBe(StatsValues.empty());
    });

    it('normal case', () => {
      const statsValue1: MockStatsValue = new MockStatsValue();
      const statsValue2: MockStatsValue = new MockStatsValue();
      const values: Array<MockStatsValue> = [
        statsValue1,
        statsValue2
      ];

      const statsValues: StatsValues = StatsValues.ofSpread(
        statsValue1,
        statsValue2
      );

      expect(statsValues.size()).toBe(values.length);
      for (let i: number = 0; i < statsValues.size(); i++) {
        expect(statsValues.get(i).get()).toBe(values[i]);
      }
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
    it('returns StatsValue of index-th item', () => {
      const values: Array<MockStatsValue> = [
        new MockStatsValue(),
        new MockStatsValue(),
        new MockStatsValue()
      ];

      const statsValues: StatsValues = StatsValues.ofArray(values);

      expect(statsValues.size()).toBe(3);
      for (let i: number = 0; i < statsValues.size(); i++) {
        expect(statsValues.get(i).get()).toBe(values[i]);
      }
    });

    it('returns Absent if the index is out of range', () => {
      const values: StatsValues = StatsValues.empty();

      expect(values.get(-1)).toBeInstanceOf(Absent);
      expect(values.get(0)).toBeInstanceOf(Absent);
    });
  });

  describe('set', () => {
    it('update pattern', () => {
      const statsValues: StatsValues = StatsValues.ofArray([
        new MockStatsValue({
          asOf: new MockAsOf({
            day: 1
          }),
          value: new MockNumericalValue(1)
        }),
        new MockStatsValue({
          asOf: new MockAsOf({
            day: 2
          }),
          value: new MockNumericalValue(2)
        }),
        new MockStatsValue({
          asOf: new MockAsOf({
            day: 3
          }),
          value: new MockNumericalValue(3)
        })
      ]);
      const statsValue: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        }),
        value: new MockNumericalValue(4)
      });

      const set: StatsValues = statsValues.set(statsValue);

      expect(set.size()).toBe(3);
      expect(set.get(0).get().getValue().get()).toBe(1);
      expect(set.get(1).get().getValue().get()).toBe(4);
      expect(set.get(2).get().getValue().get()).toBe(3);
    });

    it('insert pattern', () => {
      const statsValues: StatsValues = StatsValues.ofArray([
        new MockStatsValue({
          asOf: new MockAsOf({
            day: 1
          }),
          value: new MockNumericalValue(1)
        }),
        new MockStatsValue({
          asOf: new MockAsOf({
            day: 3
          }),
          value: new MockNumericalValue(3)
        })
      ]);
      const statsValue: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          day: 2
        }),
        value: new MockNumericalValue(2)
      });

      const set: StatsValues = statsValues.set(statsValue);

      expect(set.size()).toBe(3);
      expect(set.get(0).get().getValue().get()).toBe(1);
      expect(set.get(1).get().getValue().get()).toBe(2);
      expect(set.get(2).get().getValue().get()).toBe(3);
    });
  });

  describe('delete', () => {
    it('deletes a element if its asOf is the same', () => {
      const statsValues: StatsValues = StatsValues.ofArray([
        new MockStatsValue({
          asOf: new MockAsOf({
            day: 1
          }),
          value: new MockNumericalValue(1)
        }),
        new MockStatsValue({
          asOf: new MockAsOf({
            day: 2
          }),
          value: new MockNumericalValue(2)
        }),
        new MockStatsValue({
          asOf: new MockAsOf({
            day: 3
          }),
          value: new MockNumericalValue(3)
        })
      ]);
      const asOf: MockAsOf = new MockAsOf({
        day: 2
      });

      const deleted: StatsValues = statsValues.delete(asOf);

      expect(deleted.size()).toBe(2);
      expect(deleted.get(0).get().getValue().get()).toBe(1);
      expect(deleted.get(1).get().getValue().get()).toBe(3);
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

  describe('getValues', () => {
    it('extracts only their values', () => {
      const value1: MockNumericalValue = new MockNumericalValue(1);
      const value2: MockNumericalValue = new MockNumericalValue(3);
      const values: MockNumericalValues = new MockNumericalValues(
        value1,
        value2
      );

      const statsValues: StatsValues = StatsValues.ofArray([
        new MockStatsValue({
          asOf: new MockAsOf({
            day: 1
          }),
          value: value1
        }),
        new MockStatsValue({
          asOf: new MockAsOf({
            day: 3
          }),
          value: value2
        })
      ]);

      expect(statsValues.getValues().equals(values)).toBe(true);
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
      const asOfs: MockAsOfs = new MockAsOfs(
        asOf1,
        asOf2
      );

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
    it('returns true if the element exists', () => {
      const statsItemID: MockStatsItemID = new MockStatsItemID();
      const statsValue1: MockStatsValue = new MockStatsValue({
        statsItemID,
        asOf: new MockAsOf({
          day: 1
        }),
        value: new MockNumericalValue(1)
      });
      const statsValue2: MockStatsValue = new MockStatsValue({
        statsItemID,
        asOf: new MockAsOf({
          day: 2
        }),
        value: new MockNumericalValue(2)
      });
      const statsValue3: MockStatsValue = new MockStatsValue({
        statsItemID,
        asOf: new MockAsOf({
          day: 3
        }),
        value: new MockNumericalValue(3)
      });
      const statsValue4: MockStatsValue = new MockStatsValue({
        statsItemID,
        asOf: new MockAsOf({
          day: 1
        }),
        value: new MockNumericalValue(1)
      });

      const statsValues: StatsValues = StatsValues.ofArray([
        statsValue1,
        statsValue2
      ]);

      expect(statsValues.contains(statsValue1)).toBe(true);
      expect(statsValues.contains(statsValue2)).toBe(true);
      expect(statsValues.contains(statsValue3)).toBe(false);
      expect(statsValues.contains(statsValue4)).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements are 0', () => {
      const statsValues1: StatsValues = StatsValues.empty();
      const statsValues2: StatsValues = StatsValues.ofArray([
        new MockStatsValue(),
        new MockStatsValue()
      ]);

      expect(statsValues1.isEmpty()).toBe(true);
      expect(statsValues2.isEmpty()).toBe(false);
    });
  });

  describe('filter', () => {
    it('only returns a certain StatsItemID\'s StatsValue', () => {
      const statsItemID1: MockStatsItemID = new MockStatsItemID();
      const statsItemID2: MockStatsItemID = new MockStatsItemID();
      const statsValue1: StatsValue = new MockStatsValue({
        statsItemID: statsItemID1
      });
      const statsValue2: StatsValue = new MockStatsValue({
        statsItemID: statsItemID2
      });
      const statsValue3: StatsValue = new MockStatsValue({
        statsItemID: statsItemID2
      });
      const statsValue4: StatsValue = new MockStatsValue({
        statsItemID: statsItemID1
      });

      const statsValues: StatsValues = StatsValues.ofArray([
        statsValue1,
        statsValue2,
        statsValue3,
        statsValue4
      ]);

      const filtered1: StatsValues = statsValues.filter(statsItemID1);
      const filtered2: StatsValues = statsValues.filter(statsItemID2);

      expect(filtered1.size()).toBe(2);
      expect(filtered1.get(0).get()).toBe(statsValue1);
      expect(filtered1.get(1).get()).toBe(statsValue4);
      expect(filtered2.size()).toBe(2);
      expect(filtered2.get(0).get()).toBe(statsValue2);
      expect(filtered2.get(1).get()).toBe(statsValue3);
    });
  });

  describe('duplicate', () => {
    it('just create a new array but the objects are the same', () => {
      const statsItemID1: MockStatsItemID = new MockStatsItemID();
      const statsItemID2: MockStatsItemID = new MockStatsItemID();

      const statsValues: StatsValues = StatsValues.ofArray([
        new MockStatsValue({
          statsItemID: statsItemID1,
          value: new MockNumericalValue(1)
        }),
        new MockStatsValue({
          statsItemID: statsItemID2,
          value: new MockNumericalValue(2)
        }),
        new MockStatsValue({
          statsItemID: statsItemID2,
          value: new MockNumericalValue(3)
        }),
        new MockStatsValue({
          statsItemID: statsItemID1,
          value: new MockNumericalValue(4)
        })
      ]);
      const duplicated: StatsValues = statsValues.duplicate();

      expect(statsValues).not.toBe(duplicated);
      expect(statsValues.size()).toBe(duplicated.size());
      for (let i: number = 0; i < statsValues.size(); i++) {
        expect(statsValues.get(i).get()).toBe(duplicated.get(i).get());
      }
    });

    it('returns StatsValues.empty() if the original is empty', () => {
      expect(StatsValues.empty().duplicate()).toBe(StatsValues.empty());
    });
  });

  describe('equals', () => {
    it('returns false if the length is different', () => {
      const statsValue1: StatsValue = new MockStatsValue();
      const statsValue2: StatsValue = new MockStatsValue();

      const statsValues1: StatsValues = StatsValues.ofArray([
        statsValue1,
        statsValue2
      ]);
      const statsValues2: StatsValues = StatsValues.ofArray([
        statsValue1
      ]);

      expect(statsValues1.equals(statsValues1)).toBe(true);
      expect(statsValues1.equals(statsValues2)).toBe(false);
    });

    it('returns false if the sequence is different', () => {
      const statsValue1: StatsValue = new MockStatsValue();
      const statsValue2: StatsValue = new MockStatsValue();

      const statsValues1: StatsValues = StatsValues.ofArray([
        statsValue1,
        statsValue2
      ]);
      const statsValues2: StatsValues = StatsValues.ofArray([
        statsValue2,
        statsValue1
      ]);

      expect(statsValues1.equals(statsValues1)).toBe(true);
      expect(statsValues1.equals(statsValues2)).toBe(false);
    });

    it('returns true if the elements and their order are the same', () => {
      const statsValue1: StatsValue = new MockStatsValue();
      const statsValue2: StatsValue = new MockStatsValue();

      const statsValues1: StatsValues = StatsValues.ofArray([
        statsValue1,
        statsValue2
      ]);
      const statsValues2: StatsValues = StatsValues.ofArray([
        statsValue1,
        statsValue2
      ]);

      expect(statsValues1.equals(statsValues1)).toBe(true);
      expect(statsValues1.equals(statsValues2)).toBe(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const uuid: UUID = UUID.v4();
      const asOf1: string = '2000-01-01';
      const asOf2: string = '2000-01-02';
      const value1: number = 1;
      const value2: number = 2;
      const statsItemID: StatsItemID = StatsItemID.of(uuid);

      const statsValues: StatsValues = StatsValues.ofArray([
        StatsValue.of(
          statsItemID,
          AsOf.ofString(asOf1).get(),
          NumericalValue.of(value1)
        ),
        StatsValue.of(
          statsItemID,
          AsOf.ofString(asOf2).get(),
          NumericalValue.of(value2)
        )
      ]);

      expect(statsValues.toString()).toBe(`${uuid.get()} ${asOf1} ${value1}, ${uuid.get()} ${asOf2} ${value2}`);
    });
  });
});
