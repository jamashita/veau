import 'jest';
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

describe('StatsValues', () => {
  describe('get', () => {
    it('returns StatsValue of index-th item', () => {
      const statsItemID: StatsItemID = StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0').get();
      const statsValue1: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-01').get(), NumericalValue.of(1));
      const statsValue2: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-02').get(), NumericalValue.of(2));
      const statsValue3: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-03').get(), NumericalValue.of(3));
      const statsValues: StatsValues = StatsValues.of([
        statsValue1,
        statsValue2,
        statsValue3
      ]);

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
      const statsItemID: StatsItemID = StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0').get();
      const statsValue1: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-01').get(), NumericalValue.of(1));
      const statsValue2: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-02').get(), NumericalValue.of(2));
      const statsValue3: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-03').get(), NumericalValue.of(3));
      const statsValues: StatsValues = StatsValues.of([
        statsValue1,
        statsValue2,
        statsValue3
      ]);

      const set: StatsValues = statsValues.set(StatsValue.of(statsItemID, AsOf.ofString('2000-01-02').get(), NumericalValue.of(4)));

      expect(set.size()).toEqual(3);
      expect(set.get(0).get().getValue().get()).toEqual(1);
      expect(set.get(1).get().getValue().get()).toEqual(4);
      expect(set.get(2).get().getValue().get()).toEqual(3);
    });

    it('insert pattern', () => {
      const statsItemID: StatsItemID = StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0').get();
      const statsValue1: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-01').get(), NumericalValue.of(1));
      const statsValue3: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-03').get(), NumericalValue.of(3));
      const statsValues: StatsValues = StatsValues.of([
        statsValue1,
        statsValue3
      ]);

      const set: StatsValues = statsValues.set(StatsValue.of(statsItemID, AsOf.ofString('2000-01-02').get(), NumericalValue.of(2)));

      expect(set.size()).toEqual(3);
      expect(set.get(0).get().getValue().get()).toEqual(1);
      expect(set.get(1).get().getValue().get()).toEqual(2);
      expect(set.get(2).get().getValue().get()).toEqual(3);
    });
  });

  describe('delete', () => {
    it('deletes a element if its asOf is the same', () => {
      const statsItemID: StatsItemID = StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0').get();
      const statsValue1: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-01').get(), NumericalValue.of(1));
      const statsValue2: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-02').get(), NumericalValue.of(2));
      const statsValue3: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-03').get(), NumericalValue.of(3));
      const statsValues: StatsValues = StatsValues.of([
        statsValue1,
        statsValue2,
        statsValue3
      ]);

      const deleted: StatsValues = statsValues.delete(AsOf.ofString('2000-01-02').get());

      expect(deleted.size()).toEqual(2);
      expect(deleted.get(0).get().getValue().get()).toEqual(1);
      expect(deleted.get(1).get().getValue().get()).toEqual(3);
    });
  });

  describe('getValues', () => {
    it('extracts only their values', () => {
      const value1: NumericalValue = NumericalValue.of(1);
      const value2: NumericalValue = NumericalValue.of(3);
      const statsItemID: StatsItemID = StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0').get();
      const statsValues: StatsValues = StatsValues.of([
        StatsValue.of(statsItemID, AsOf.ofString('2000-01-01').get(), value1),
        StatsValue.of(statsItemID, AsOf.ofString('2000-01-03').get(), value2)
      ]);

      expect(statsValues.getValues()).toEqual([
        value1,
        value2
      ]);
    });
  });

  describe('getAdOfs', () => {
    it('extracts only their asOfs', () => {
      const statsItemID: StatsItemID = StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0').get();
      const asOf1: AsOf = AsOf.ofString('2000-01-01').get();
      const asOf2: AsOf = AsOf.ofString('2000-01-03').get();
      const statsValues: StatsValues = StatsValues.of([
        StatsValue.of(statsItemID, asOf1, NumericalValue.of(1)),
        StatsValue.of(statsItemID, asOf2, NumericalValue.of(3))
      ]);

      expect(statsValues.getAsOfs().size()).toEqual(2);
      expect(statsValues.getAsOfs().get(0).get()).toEqual(asOf1);
      expect(statsValues.getAsOfs().get(1).get()).toEqual(asOf2);
    });
  });

  describe('contains', () => {
    it('returns true if the element exists in the Colors', () => {
      const statsItemID: StatsItemID = StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0').get();
      const statsValue1: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-01').get(), NumericalValue.of(1));
      const statsValue2: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-02').get(), NumericalValue.of(2));
      const statsValue3: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-03').get(), NumericalValue.of(3));
      const statsValue4: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-01').get(), NumericalValue.of(1));
      const statsValues: StatsValues = StatsValues.of([
        statsValue1,
        statsValue2
      ]);

      expect(statsValues.contains(statsValue1)).toEqual(true);
      expect(statsValues.contains(statsValue2)).toEqual(true);
      expect(statsValues.contains(statsValue3)).toEqual(false);
      expect(statsValues.contains(statsValue4)).toEqual(true);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements are 0', () => {
      const statsItemID: StatsItemID = StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0').get();
      const statsValue1: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-01').get(), NumericalValue.of(1));
      const statsValue2: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-02').get(), NumericalValue.of(2));
      const statsValues1: StatsValues = StatsValues.of([
      ]);
      const statsValues2: StatsValues = StatsValues.of([
        statsValue1,
        statsValue2
      ]);

      expect(statsValues1.isEmpty()).toEqual(true);
      expect(statsValues2.isEmpty()).toEqual(false);
    });
  });

  describe('filter', () => {
    it('only returns a certain StatsItemID\'s StatsValue', () => {
      const statsItemID1: StatsItemID = StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0').get();
      const statsItemID2: StatsItemID = StatsItemID.of('b5f208c3-f171-488f-a8dc-f3798db5f9f4').get();
      const statsValue1: StatsValue = StatsValue.of(statsItemID1, AsOf.ofString('2000-01-01').get(), NumericalValue.of(1));
      const statsValue2: StatsValue = StatsValue.of(statsItemID2, AsOf.ofString('2000-01-02').get(), NumericalValue.of(2));
      const statsValue3: StatsValue = StatsValue.of(statsItemID2, AsOf.ofString('2000-01-03').get(), NumericalValue.of(3));
      const statsValue4: StatsValue = StatsValue.of(statsItemID1, AsOf.ofString('2000-01-04').get(), NumericalValue.of(1));
      const statsValues: StatsValues = StatsValues.of([
        statsValue1,
        statsValue2,
        statsValue3,
        statsValue4
      ]);

      const filtered1: StatsValues = statsValues.filter(statsItemID1);
      const filtered2: StatsValues = statsValues.filter(statsItemID2);

      expect(filtered1.size()).toEqual(2);
      expect(filtered1.get(0).get().getAsOf().toString()).toEqual('2000-01-01');
      expect(filtered1.get(1).get().getAsOf().toString()).toEqual('2000-01-04');
      expect(filtered2.size()).toEqual(2);
      expect(filtered2.get(0).get().getAsOf().toString()).toEqual('2000-01-02');
      expect(filtered2.get(1).get().getAsOf().toString()).toEqual('2000-01-03');
    });
  });

  describe('copy', () => {
    it('just create a new array but the objects are the same', () => {
      const statsItemID1: StatsItemID = StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0').get();
      const statsItemID2: StatsItemID = StatsItemID.of('b5f208c3-f171-488f-a8dc-f3798db5f9f4').get();
      const statsValue1: StatsValue = StatsValue.of(statsItemID1, AsOf.ofString('2000-01-01').get(), NumericalValue.of(1));
      const statsValue2: StatsValue = StatsValue.of(statsItemID2, AsOf.ofString('2000-01-02').get(), NumericalValue.of(2));
      const statsValue3: StatsValue = StatsValue.of(statsItemID2, AsOf.ofString('2000-01-03').get(), NumericalValue.of(3));
      const statsValue4: StatsValue = StatsValue.of(statsItemID1, AsOf.ofString('2000-01-04').get(), NumericalValue.of(1));
      const statsValues: StatsValues = StatsValues.of([
        statsValue1,
        statsValue2,
        statsValue3,
        statsValue4
      ]);
      const copied: StatsValues = statsValues.copy();

      expect(statsValues).not.toBe(copied);
      expect(statsValues.size()).toEqual(copied.size());
      for (let i: number = 0; i < statsValues.size(); i++) {
        expect(statsValues.get(i).equals(copied.get(i))).toEqual(true);
      }
    });
  });

  describe('equals', () => {
    it('returns false if the length is differnet', () => {
      const statsItemID: StatsItemID = StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0').get();
      const statsValue1: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-01').get(), NumericalValue.of(1));
      const statsValue2: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-02').get(), NumericalValue.of(2));

      const statsValues1: StatsValues = StatsValues.of([
        statsValue1,
        statsValue2
      ]);
      const statsValues2: StatsValues = StatsValues.of([
        statsValue1
      ]);

      expect(statsValues1.equals(statsValues1)).toEqual(true);
      expect(statsValues1.equals(statsValues2)).toEqual(false);
    });

    it('returns false if the sequence is different', () => {
      const statsItemID: StatsItemID = StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0').get();
      const statsValue1: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-01').get(), NumericalValue.of(1));
      const statsValue2: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-02').get(), NumericalValue.of(2));

      const statsValues1: StatsValues = StatsValues.of([
        statsValue1,
        statsValue2
      ]);
      const statsValues2: StatsValues = StatsValues.of([
        statsValue2,
        statsValue1
      ]);

      expect(statsValues1.equals(statsValues1)).toEqual(true);
      expect(statsValues1.equals(statsValues2)).toEqual(false);
    });

    it('returns true if the elements and their order are the same', () => {
      const statsItemID: StatsItemID = StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0').get();
      const statsValue1: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-01').get(), NumericalValue.of(1));
      const statsValue2: StatsValue = StatsValue.of(statsItemID, AsOf.ofString('2000-01-02').get(), NumericalValue.of(2));

      const statsValues1: StatsValues = StatsValues.of([
        statsValue1,
        statsValue2
      ]);
      const statsValues2: StatsValues = StatsValues.of([
        statsValue1,
        statsValue2
      ]);

      expect(statsValues1.equals(statsValues1)).toEqual(true);
      expect(statsValues1.equals(statsValues2)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const id: string = 'f186dad1-6170-4fdc-9020-d73d9bf86fb0';
      const asOf1: string = '2000-01-01';
      const asOf2: string = '2000-01-02';
      const value1: number = 1;
      const value2: number = 2;
      const statsItemID: StatsItemID = StatsItemID.of(id).get();
      const statsValue1: StatsValue = StatsValue.of(statsItemID, AsOf.ofString(asOf1).get(), NumericalValue.of(value1));
      const statsValue2: StatsValue = StatsValue.of(statsItemID, AsOf.ofString(asOf2).get(), NumericalValue.of(value2));

      const statsValues: StatsValues = StatsValues.of([
        statsValue1,
        statsValue2
      ]);

      expect(statsValues.toString()).toEqual(`${id} ${asOf1} ${value1}, ${id} ${asOf2} ${value2}`);
    });
  });

  describe('ofTry', () => {
    it('normal case', () => {
      const id: string = 'f186dad1-6170-4fdc-9020-d73d9bf86fb0';
      const asOf1: string = '2000-01-01';
      const asOf2: string = '2000-01-02';
      const value1: number = 1;
      const value2: number = 2;
      const statsItemID: StatsItemID = StatsItemID.of(id).get();
      const statsValue1: StatsValue = StatsValue.of(statsItemID, AsOf.ofString(asOf1).get(), NumericalValue.of(value1));
      const statsValue2: StatsValue = StatsValue.of(statsItemID, AsOf.ofString(asOf2).get(), NumericalValue.of(value2));

      const trial1: Try<StatsValue, StatsValueError> = Success.of<StatsValue, StatsValueError>(statsValue1);
      const trial2: Try<StatsValue, StatsValueError> = Success.of<StatsValue, StatsValueError>(statsValue2);

      const trial: Try<StatsValues, StatsValuesError> = StatsValues.ofTry([trial1, trial2]);

      expect(trial.isSuccess()).toEqual(true);
      const values: StatsValues = trial.get();
      expect(values.size()).toEqual(2);
      expect(values.get(0).get()).toEqual(statsValue1);
      expect(values.get(1).get()).toEqual(statsValue2);
    });

    it('contains failure', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const id: string = 'f186dad1-6170-4fdc-9020-d73d9bf86fb0';
      const asOf1: string = '2000-01-01';
      const value1: number = 1;
      const statsItemID: StatsItemID = StatsItemID.of(id).get();
      const statsValue1: StatsValue = StatsValue.of(statsItemID, AsOf.ofString(asOf1).get(), NumericalValue.of(value1));

      const trial1: Try<StatsValue, StatsValueError> = Success.of<StatsValue, StatsValueError>(statsValue1);
      const trial2: Try<StatsValue, StatsValueError> = Failure.of<StatsValue, StatsValueError>(new StatsValueError('test failed'));

      const trial: Try<StatsValues, StatsValuesError> = StatsValues.ofTry([trial1, trial2]);

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

      const trial: Try<StatsValues, StatsValuesError> = StatsValues.ofTry([trial1, trial2]);

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
      const id: string = 'f186dad1-6170-4fdc-9020-d73d9bf86fb0';
      const statsItemID: StatsItemID = StatsItemID.of(id).get();

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
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

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
      const id: string = 'f186dad1-6170-4fdc-9020-d73d9bf86fb0';
      const statsItemID: StatsItemID = StatsItemID.of(id).get();

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
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

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
      const id: string = 'f186dad1-6170-4fdc-9020-d73d9bf86fb0';
      const statsItemID: StatsItemID = StatsItemID.of(id).get();

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
        expect(value.getStatsItemID().get()).toEqual(row[i].statsItemID);
        expect(value.getAsOf().toString()).toEqual(row[i].asOf);
        expect(value.getValue().get()).toEqual(row[i].value);
      }
    });

    it('contains malformat statsItemID', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

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
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

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
});
