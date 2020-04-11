import sinon, { SinonSpy } from 'sinon';
import { StatsValueError } from '../../veau-error/StatsValueError';
import { StatsValuesError } from '../../veau-error/StatsValuesError';
import { None } from '../../veau-general/Optional/None';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { AsOf } from '../AsOf';
import { NumericalValue } from '../NumericalValue';
import { StatsItemID } from '../StatsItemID';
import { StatsValue, StatsValueJSON, StatsValueRow } from '../StatsValue';
import { StatsValues } from '../StatsValues';
import { MockStatsValue } from '../Mock/MockStatsValue';
import { MockStatsItemID } from '../Mock/MockStatsItemID';
import { MockAsOf } from '../Mock/MockAsOf';
import { MockNumericalValue } from '../Mock/MockNumericalValue';
import { MockNumericalValues } from '../Mock/MockNumericalValues';
import { UUID } from '../../veau-general/UUID/UUID';

describe('StatsValues', () => {
  describe('ofTry', () => {
    it('normal case', () => {
      const statsValue1: MockStatsValue = new MockStatsValue();
      const statsValue2: MockStatsValue = new MockStatsValue();

      const trial1: Try<StatsValue, StatsValueError> = Success.of<StatsValue, StatsValueError>(statsValue1);
      const trial2: Try<StatsValue, StatsValueError> = Success.of<StatsValue, StatsValueError>(statsValue2);
      const trial: Try<StatsValues, StatsValuesError> = StatsValues.ofTry([
        trial1,
        trial2
      ]);

      expect(trial.isSuccess()).toEqual(true);
      const values: StatsValues = trial.get();
      expect(values.size()).toEqual(2);
      expect(values.get(0).get()).toEqual(statsValue1);
      expect(values.get(1).get()).toEqual(statsValue2);
    });

    it('contains failure', () => {
      const statsValue1: MockStatsValue = new MockStatsValue();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const trial1: Try<StatsValue, StatsValueError> = Success.of<StatsValue, StatsValueError>(statsValue1);
      const trial2: Try<StatsValue, StatsValueError> = Failure.of<StatsValue, StatsValueError>(new StatsValueError('test failed'));
      const trial: Try<StatsValues, StatsValuesError> = StatsValues.ofTry([
        trial1,
        trial2
      ]);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsValuesError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsValuesError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('will be multiple failures', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const trial1: Try<StatsValue, StatsValueError> = Failure.of<StatsValue, StatsValueError>(new StatsValueError('test failed1'));
      const trial2: Try<StatsValue, StatsValueError> = Failure.of<StatsValue, StatsValueError>(new StatsValueError('test failed2'));
      const trial: Try<StatsValues, StatsValuesError> = StatsValues.ofTry([
        trial1,
        trial2
      ]);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsValuesError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsValuesError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('ofJSON', () => {
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

      const trial: Try<StatsValues, StatsValuesError> = StatsValues.ofJSON(statsItemID, json);

      expect(trial.isSuccess()).toEqual(true);
      const values: StatsValues = trial.get();
      expect(values.size()).toEqual(json.length);
      for (let i: number = 0; i < values.size(); i++) {
        const value: StatsValue = values.get(i).get();
        expect(value.getStatsItemID()).toEqual(statsItemID);
        expect(value.getAsOf().toString()).toEqual(json[i].asOf);
        expect(value.getValue().get()).toEqual(json[i].value);
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
      const statsItemID: MockStatsItemID = new MockStatsItemID();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const trial: Try<StatsValues, StatsValuesError> = StatsValues.ofJSON(statsItemID, json);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsValuesError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsValuesError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
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
      const statsItemID: MockStatsItemID = new MockStatsItemID();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const trial: Try<StatsValues, StatsValuesError> = StatsValues.ofJSON(statsItemID, json);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsValuesError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsValuesError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('ofRow', () => {
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

      const trial: Try<StatsValues, StatsValuesError> = StatsValues.ofRow(row);

      expect(trial.isSuccess()).toEqual(true);
      const values: StatsValues = trial.get();
      expect(values.size()).toEqual(row.length);
      for (let i: number = 0; i < values.size(); i++) {
        const value: StatsValue = values.get(i).get();
        expect(value.getStatsItemID().get().get()).toEqual(row[i].statsItemID);
        expect(value.getAsOf().toString()).toEqual(row[i].asOf);
        expect(value.getValue().get()).toEqual(row[i].value);
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

      const trial: Try<StatsValues, StatsValuesError> = StatsValues.ofRow(row);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsValuesError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsValuesError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
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

      const trial: Try<StatsValues, StatsValuesError> = StatsValues.ofRow(row);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsValuesError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsValuesError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('ofArray', () => {
    it('normal case', () => {
      const statsValue1: MockStatsValue = new MockStatsValue();
      const statsValue2: MockStatsValue = new MockStatsValue();
      const values: Array<MockStatsValue> = [
        statsValue1,
        statsValue2
      ];

      const statsValues : StatsValues = StatsValues.ofArray(values);

      expect(statsValues.size()).toEqual(values.length);
      for (let i: number = 0; i < statsValues.size(); i++) {
        expect(statsValues.get(i).get()).toEqual(values[i]);
      }
    });
  });

  describe('ofSpread', () => {
    it('normal case', () => {
      const statsValue1: MockStatsValue = new MockStatsValue();
      const statsValue2: MockStatsValue = new MockStatsValue();
      const values: Array<MockStatsValue> = [
        statsValue1,
        statsValue2
      ];

      const statsValues : StatsValues = StatsValues.ofSpread(statsValue1, statsValue2);

      expect(statsValues.size()).toEqual(values.length);
      for (let i: number = 0; i < statsValues.size(); i++) {
        expect(statsValues.get(i).get()).toEqual(values[i]);
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

      expect(StatsValues.isJSON(n)).toEqual(true);
    });

    it('returns false because given parameter is not an object', () => {
      expect(StatsValues.isJSON(null)).toEqual(false);
      expect(StatsValues.isJSON(undefined)).toEqual(false);
      expect(StatsValues.isJSON(56)).toEqual(false);
      expect(StatsValues.isJSON('fjafsd')).toEqual(false);
      expect(StatsValues.isJSON(false)).toEqual(false);
    });

    it('returns false because given parameter is not an array', () => {
      expect(StatsValues.isJSON({})).toEqual(false);
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

      expect(StatsValues.isJSON(n)).toEqual(false);
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

      expect(StatsValues.isJSON(n)).toEqual(false);
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

      expect(StatsValues.isJSON(n)).toEqual(false);
    });
  });

  describe('empty', () => {
    it('must be 0 length StatsValues', () => {
      expect(StatsValues.empty().isEmpty()).toEqual(true);
    });
  });

  describe('get', () => {
    it('returns StatsValue of index-th item', () => {
      const statsValue1: MockStatsValue = new MockStatsValue();
      const statsValue2: MockStatsValue = new MockStatsValue();
      const statsValue3: MockStatsValue = new MockStatsValue();

      const statsValues: StatsValues = StatsValues.ofSpread(
        statsValue1,
        statsValue2,
        statsValue3
      );

      expect(statsValues.size()).toEqual(3);
      expect(statsValues.get(0).get()).toEqual(statsValue1);
      expect(statsValues.get(1).get()).toEqual(statsValue2);
      expect(statsValues.get(2).get()).toEqual(statsValue3);
    });

    it('returns None if the index is out of range', () => {
      const values: StatsValues = StatsValues.empty();

      expect(values.get(-1)).toBeInstanceOf(None);
      expect(values.get(0)).toBeInstanceOf(None);
    });
  });

  describe('set', () => {
    it('update pattern', () => {
      const statsValue1: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          year: 2000,
          month: 1,
          day: 1
        }),
        value: new MockNumericalValue(1)
      });
      const statsValue2: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          year: 2000,
          month: 1,
          day: 2
        }),
        value: new MockNumericalValue(2)
      });
      const statsValue3: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          year: 2000,
          month: 1,
          day: 3
        }),
        value: new MockNumericalValue(3)
      });
      const statsValue4: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          year: 2000,
          month: 1,
          day: 2
        }),
        value: new MockNumericalValue(4)
      });

      const statsValues: StatsValues = StatsValues.ofSpread(
        statsValue1,
        statsValue2,
        statsValue3
      );
      const set: StatsValues = statsValues.set(statsValue4);

      expect(set.size()).toEqual(3);
      expect(set.get(0).get().getValue().get()).toEqual(1);
      expect(set.get(1).get().getValue().get()).toEqual(4);
      expect(set.get(2).get().getValue().get()).toEqual(3);
    });

    it('insert pattern', () => {
      const statsValue1: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          year: 2000,
          month: 1,
          day: 1
        }),
        value: new MockNumericalValue(1)
      });
      const statsValue2: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          year: 2000,
          month: 1,
          day: 2
        }),
        value: new MockNumericalValue(2)
      });
      const statsValue3: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          year: 2000,
          month: 1,
          day: 3
        }),
        value: new MockNumericalValue(3)
      });

      const statsValues: StatsValues = StatsValues.ofSpread(
        statsValue1,
        statsValue3
      );
      const set: StatsValues = statsValues.set(statsValue2);

      expect(set.size()).toEqual(3);
      expect(set.get(0).get().getValue().get()).toEqual(1);
      expect(set.get(1).get().getValue().get()).toEqual(2);
      expect(set.get(2).get().getValue().get()).toEqual(3);
    });
  });

  describe('delete', () => {
    it('deletes a element if its asOf is the same', () => {
      const statsValue1: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          year: 2000,
          month: 1,
          day: 1
        }),
        value: new MockNumericalValue(1)
      });
      const statsValue2: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          year: 2000,
          month: 1,
          day: 2
        }),
        value: new MockNumericalValue(2)
      });
      const statsValue3: MockStatsValue = new MockStatsValue({
        asOf: new MockAsOf({
          year: 2000,
          month: 1,
          day: 3
        }),
        value: new MockNumericalValue(3)
      });
      const deleteAsOf: MockAsOf = new MockAsOf({
        year: 2000,
        month: 1,
        day: 2
      });

      const statsValues: StatsValues = StatsValues.ofSpread(
        statsValue1,
        statsValue2,
        statsValue3
      );
      const deleted: StatsValues = statsValues.delete(deleteAsOf);

      expect(deleted.size()).toEqual(2);
      expect(deleted.get(0).get().getValue().get()).toEqual(1);
      expect(deleted.get(1).get().getValue().get()).toEqual(3);
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

      const statsValues: StatsValues = StatsValues.ofSpread(
        new MockStatsValue({
          asOf: new MockAsOf({
            year: 2000,
            month: 1,
            day: 1
          }),
          value: value1
        }),
        new MockStatsValue({
          asOf: new MockAsOf({
            year: 2000,
            month: 1,
            day: 3
          }),
          value: value2
        })
      );

      expect(statsValues.getValues().equals(values)).toEqual(true);
    });
  });

  describe('getAdOfs', () => {
    it('extracts only their asOfs', () => {
      const asOf1: MockAsOf = new MockAsOf({
        year: 2000,
        month: 1,
        day: 3
      });
      const asOf2: MockAsOf = new MockAsOf({
        year: 2000,
        month: 1,
        day: 3
      });

      const statsValues: StatsValues = StatsValues.ofSpread(
        new MockStatsValue({
          asOf: asOf1
        }),
        new MockStatsValue({
          asOf: asOf2
        })
      );

      expect(statsValues.getAsOfs().size()).toEqual(2);
      expect(statsValues.getAsOfs().get(0).get()).toEqual(asOf1);
      expect(statsValues.getAsOfs().get(1).get()).toEqual(asOf2);
    });
  });

  describe('contains', () => {
    it('returns true if the element exists', () => {
      const statsItemID: MockStatsItemID = new MockStatsItemID();
      const statsValue1: MockStatsValue = new MockStatsValue({
        statsItemID,
        asOf: new MockAsOf({
          year: 2000,
          month: 1,
          day: 1
        }),
        value: new MockNumericalValue(1)
     });
      const statsValue2: MockStatsValue = new MockStatsValue({
        statsItemID,
        asOf: new MockAsOf({
          year: 2000,
          month: 1,
          day: 2
        }),
        value: new MockNumericalValue(2)
      });
      const statsValue3: MockStatsValue = new MockStatsValue({
        statsItemID,
        asOf: new MockAsOf({
          year: 2000,
          month: 1,
          day: 3
        }),
        value: new MockNumericalValue(3)
      });
      const statsValue4: MockStatsValue = new MockStatsValue({
        statsItemID,
        asOf: new MockAsOf({
          year: 2000,
          month: 1,
          day: 1
        }),
        value: new MockNumericalValue(1)
      });

      const statsValues: StatsValues = StatsValues.ofSpread(
        statsValue1,
        statsValue2
      );

      expect(statsValues.contains(statsValue1)).toEqual(true);
      expect(statsValues.contains(statsValue2)).toEqual(true);
      expect(statsValues.contains(statsValue3)).toEqual(false);
      expect(statsValues.contains(statsValue4)).toEqual(true);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements are 0', () => {
      const statsValue1: MockStatsValue = new MockStatsValue();
      const statsValue2: MockStatsValue = new MockStatsValue();

      const statsValues1: StatsValues = StatsValues.ofSpread();
      const statsValues2: StatsValues = StatsValues.ofSpread(
        statsValue1,
        statsValue2
      );

      expect(statsValues1.isEmpty()).toEqual(true);
      expect(statsValues2.isEmpty()).toEqual(false);
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

      const statsValues: StatsValues = StatsValues.ofSpread(
        statsValue1,
        statsValue2,
        statsValue3,
        statsValue4
      );

      const filtered1: StatsValues = statsValues.filter(statsItemID1);
      const filtered2: StatsValues = statsValues.filter(statsItemID2);

      expect(filtered1.size()).toEqual(2);
      expect(filtered1.get(0).get()).toEqual(statsValue1);
      expect(filtered1.get(1).get()).toEqual(statsValue4);
      expect(filtered2.size()).toEqual(2);
      expect(filtered2.get(0).get()).toEqual(statsValue2);
      expect(filtered2.get(1).get()).toEqual(statsValue3);
    });
  });

  describe('copy', () => {
    it('just create a new array but the objects are the same', () => {
      const statsItemID1: MockStatsItemID = new MockStatsItemID();
      const statsItemID2: MockStatsItemID = new MockStatsItemID();
      const statsValue1: StatsValue = new MockStatsValue({
        statsItemID: statsItemID1,
        value: new MockNumericalValue(1)
      });
      const statsValue2: StatsValue = new MockStatsValue({
        statsItemID: statsItemID2,
        value: new MockNumericalValue(2)
      });
      const statsValue3: StatsValue = new MockStatsValue({
        statsItemID: statsItemID2,
        value: new MockNumericalValue(3)
      });
      const statsValue4: StatsValue = new MockStatsValue({
        statsItemID: statsItemID1,
        value: new MockNumericalValue(4)
      });

      const statsValues: StatsValues = StatsValues.ofSpread(
        statsValue1,
        statsValue2,
        statsValue3,
        statsValue4
      );
      const copied: StatsValues = statsValues.copy();

      expect(statsValues).not.toBe(copied);
      expect(statsValues.size()).toEqual(copied.size());
      for (let i: number = 0; i < statsValues.size(); i++) {
        expect(statsValues.get(i).get().equals(copied.get(i).get())).toEqual(true);
      }
    });
  });

  describe('equals', () => {
    it('returns false if the length is different', () => {
      const statsValue1: StatsValue = new MockStatsValue();
      const statsValue2: StatsValue = new MockStatsValue();

      const statsValues1: StatsValues = StatsValues.ofSpread(
        statsValue1,
        statsValue2
      );
      const statsValues2: StatsValues = StatsValues.ofSpread(
        statsValue1
      );

      expect(statsValues1.equals(statsValues1)).toEqual(true);
      expect(statsValues1.equals(statsValues2)).toEqual(false);
    });

    it('returns false if the sequence is different', () => {
      const statsValue1: StatsValue = new MockStatsValue();
      const statsValue2: StatsValue = new MockStatsValue();

      const statsValues1: StatsValues = StatsValues.ofSpread(
        statsValue1,
        statsValue2
      );
      const statsValues2: StatsValues = StatsValues.ofSpread(
        statsValue2,
        statsValue1
      );

      expect(statsValues1.equals(statsValues1)).toEqual(true);
      expect(statsValues1.equals(statsValues2)).toEqual(false);
    });

    it('returns true if the elements and their order are the same', () => {
      const statsValue1: StatsValue = new MockStatsValue();
      const statsValue2: StatsValue = new MockStatsValue();

      const statsValues1: StatsValues = StatsValues.ofSpread(
        statsValue1,
        statsValue2
      );
      const statsValues2: StatsValues = StatsValues.ofSpread(
        statsValue1,
        statsValue2
      );

      expect(statsValues1.equals(statsValues1)).toEqual(true);
      expect(statsValues1.equals(statsValues2)).toEqual(true);
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
      const statsValue1: StatsValue = StatsValue.of(statsItemID, AsOf.ofString(asOf1).get(), NumericalValue.of(value1));
      const statsValue2: StatsValue = StatsValue.of(statsItemID, AsOf.ofString(asOf2).get(), NumericalValue.of(value2));

      const statsValues: StatsValues = StatsValues.ofSpread(
        statsValue1,
        statsValue2
      );

      expect(statsValues.toString()).toEqual(`${uuid.get()} ${asOf1} ${value1}, ${uuid.get()} ${asOf2} ${value2}`);
    });
  });
});
