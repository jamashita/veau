import sinon, { SinonSpy } from 'sinon';
import { StatsItemError } from '../../veau-error/StatsItemError';
import { Try } from '../../veau-general/Try/Try';
import { UUID } from '../../veau-general/UUID/UUID';
import { AsOf } from '../../veau-vo/AsOf';
import { AsOfs } from '../../veau-vo/AsOfs';
import { NumericalValue } from '../../veau-vo/NumericalValue';
import { NumericalValues } from '../../veau-vo/NumericalValues';
import { StatsItemID } from '../../veau-vo/StatsItemID';
import { StatsItemName } from '../../veau-vo/StatsItemName';
import { StatsValue } from '../../veau-vo/StatsValue';
import { StatsValues } from '../../veau-vo/StatsValues';
import { StatsItem, StatsItemJSON, StatsItemRow } from '../StatsItem';

describe('StatsItem', () => {
  describe('equals', () => {
    it('returns true when the ids equal', () => {
      const statsItemID1: StatsItemID = StatsItemID.ofString('f186dad1-6170-4fdc-9020-d73d9bf86fb0').get();
      const statsItemID2: StatsItemID = StatsItemID.ofString('b5f208c3-f171-488f-a8dc-f3798db5f9f4').get();
      const statsItem1: StatsItem = StatsItem.of(statsItemID1, StatsItemName.of('name 1'), StatsValues.empty());
      const statsItem2: StatsItem = StatsItem.of(statsItemID2, StatsItemName.of('name 1'), StatsValues.empty());
      const statsItem3: StatsItem = StatsItem.of(statsItemID1, StatsItemName.of('name 3'), StatsValues.ofArray([
        StatsValue.of(statsItemID1, AsOf.ofString('2000-01-01').get(), NumericalValue.of(10))
      ]));

      expect(statsItem1.equals(statsItem1)).toEqual(true);
      expect(statsItem1.equals(statsItem2)).toEqual(false);
      expect(statsItem1.equals(statsItem3)).toEqual(true);
    });
  });

  describe('isSame', () => {
    it('returns true if all the properties are the same', () => {
      const statsItemID1: StatsItemID = StatsItemID.ofString('f186dad1-6170-4fdc-9020-d73d9bf86fb0').get();
      const statsItemID2: StatsItemID = StatsItemID.ofString('b5f208c3-f171-488f-a8dc-f3798db5f9f4').get();
      const statsItem1: StatsItem = StatsItem.of(statsItemID1, StatsItemName.of('name 1'), StatsValues.ofArray([
        StatsValue.of(statsItemID1, AsOf.ofString('2000-01-01').get(), NumericalValue.of(10))
      ]));
      const statsItem2: StatsItem = StatsItem.of(statsItemID2, StatsItemName.of('name 1'), StatsValues.ofArray([
        StatsValue.of(statsItemID2, AsOf.ofString('2000-01-01').get(), NumericalValue.of(10))
      ]));
      const statsItem3: StatsItem = StatsItem.of(statsItemID1, StatsItemName.of('name 3'), StatsValues.ofArray([
        StatsValue.of(statsItemID1, AsOf.ofString('2000-01-01').get(), NumericalValue.of(10))
      ]));
      const statsItem4: StatsItem = StatsItem.of(statsItemID1, StatsItemName.of('name 1'), StatsValues.ofArray([
        StatsValue.of(statsItemID1, AsOf.ofString('2000-01-01').get(), NumericalValue.of(10)),
        StatsValue.of(statsItemID1, AsOf.ofString('2000-01-02').get(), NumericalValue.of(10))
      ]));
      const statsItem5: StatsItem = StatsItem.of(statsItemID1, StatsItemName.of('name 1'), StatsValues.ofArray([
        StatsValue.of(statsItemID1, AsOf.ofString('2000-01-02').get(), NumericalValue.of(10))
      ]));
      const statsItem6: StatsItem = StatsItem.of(statsItemID1, StatsItemName.of('name 1'), StatsValues.ofArray([
        StatsValue.of(statsItemID1, AsOf.ofString('2000-01-01').get(), NumericalValue.of(10))
      ]));

      expect(statsItem1.isSame(statsItem1)).toEqual(true);
      expect(statsItem1.isSame(statsItem2)).toEqual(false);
      expect(statsItem1.isSame(statsItem3)).toEqual(false);
      expect(statsItem1.isSame(statsItem4)).toEqual(false);
      expect(statsItem1.isSame(statsItem5)).toEqual(false);
      expect(statsItem1.isSame(statsItem6)).toEqual(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const statsItemID: StatsItemID = StatsItemID.ofString('b5f208c3-f171-488f-a8dc-f3798db5f9f4').get();
      const statsItem: StatsItem = StatsItem.of(statsItemID, StatsItemName.of('name 1'), StatsValues.ofArray([StatsValue.of(statsItemID, AsOf.ofString('2000-01-01').get(), NumericalValue.of(10))]));

      expect(statsItem.toJSON()).toEqual({
        statsItemID: 'b5f208c3-f171-488f-a8dc-f3798db5f9f4',
        name: 'name 1',
        values: [
          {
            asOf: '2000-01-01',
            value: 10
          }
        ]
      });
    });
  });

  describe('getAdOfs', () => {
    it('extracts only their asOfs', () => {
      const statsItemID: StatsItemID = StatsItemID.ofString('0816ef5e-752d-41ad-b52a-95b1f16e3bbd').get();
      const asOf1: AsOf = AsOf.ofString('2000-01-01').get();
      const asOf2: AsOf = AsOf.ofString('2000-01-03').get();
      const statsItem: StatsItem = StatsItem.of(statsItemID, StatsItemName.of('name 1'), StatsValues.ofArray(
        [
          StatsValue.of(statsItemID, asOf1, NumericalValue.of(1)),
          StatsValue.of(statsItemID, asOf2, NumericalValue.of(3))
        ]
      ));

      expect(statsItem.getAsOfs().size()).toEqual(2);
      expect(statsItem.getAsOfs().get(0).get()).toEqual(asOf1);
      expect(statsItem.getAsOfs().get(1).get()).toEqual(asOf2);
    });
  });

  describe('getValuesByColumn', () => {
    it('returns empty string when the date is empty ', () => {
      const statsItemID: StatsItemID = StatsItemID.ofString('aa28c422-67e2-41e2-bbe6-a97c7d63c44f').get();
      const column: AsOfs = AsOfs.ofArray([
        AsOf.ofString('2000-01-01').get(),
        AsOf.ofString('2000-01-02').get(),
        AsOf.ofString('2000-01-03').get()
      ]);
      const statsItem: StatsItem = StatsItem.of(statsItemID, StatsItemName.of('name 1'), StatsValues.ofArray([
        StatsValue.of(statsItemID, AsOf.ofString('2000-01-01').get(), NumericalValue.of(1)),
        StatsValue.of(statsItemID, AsOf.ofString('2000-01-03').get(), NumericalValue.of(3))
      ]));

      const values: NumericalValues = statsItem.getValuesByColumn(column);

      expect(values.size()).toEqual(3);
      expect(values.get(0).get().toString()).toEqual('1');
      expect(values.get(1).get().toString()).toEqual('');
      expect(values.get(2).get().toString()).toEqual('3');
    });
  });

  describe('isFilled', () => {
    it('returns true if the name is filled', () => {
      const statsItem1: StatsItem = StatsItem.of(StatsItemID.ofString('5ee0c273-c26f-432f-9217-d6a7b481a073').get(), StatsItemName.default(), StatsValues.empty());
      const statsItem2: StatsItem = StatsItem.of(StatsItemID.ofString('5ee0c273-c26f-432f-9217-d6a7b481a073').get(), StatsItemName.of('name'), StatsValues.empty());

      expect(statsItem1.isFilled()).toEqual(false);
      expect(statsItem2.isFilled()).toEqual(true);
    });
  });

  describe('isValid', () => {
    it('returns true if the name is filled', () => {
      const statsItem1: StatsItem = StatsItem.of(StatsItemID.ofString('5ee0c273-c26f-432f-9217-d6a7b481a073').get(), StatsItemName.default(), StatsValues.empty());
      const statsItem2: StatsItem = StatsItem.of(StatsItemID.ofString('5ee0c273-c26f-432f-9217-d6a7b481a073').get(), StatsItemName.of('name'), StatsValues.empty());

      expect(statsItem1.isValid()).toEqual(false);
      expect(statsItem2.isValid()).toEqual(true);
    });
  });

  describe('copy', () => {
    it('evert properties are copied', () => {
      const statsItemID: StatsItemID = StatsItemID.ofString('5ee0c273-c26f-432f-9217-d6a7b481a073').get();
      const name: StatsItemName = StatsItemName.of('name');
      const statsValues: StatsValues = StatsValues.empty();

      const statsItem: StatsItem = StatsItem.of(statsItemID, name, statsValues);
      const copy: StatsItem = statsItem.copy();

      expect(statsItem).not.toBe(copy);
      expect(statsItem.getStatsItemID()).toEqual(statsItemID);
      expect(statsItem.getName()).toEqual(name);
      expect(statsItem.getValues()).toEqual(statsValues);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const id: string = '5ee0c273-c26f-432f-9217-d6a7b481a073'
      const name: string = 'name';
      const statsItemID: StatsItemID = StatsItemID.ofString(id).get();
      const statsItemName: StatsItemName = StatsItemName.of(name);
      const statsValues: StatsValues = StatsValues.empty();

      const statsItem: StatsItem = StatsItem.of(statsItemID, statsItemName, statsValues);

      expect(statsItem.toString()).toEqual(`${id} ${name} `);
    });
  });

  describe('of', () => {
    it('normal case', () => {
      const statsItemID: StatsItemID = StatsItemID.ofString('4d0cf4e5-4f48-4db3-9c04-085374d857d1').get();
      const name: StatsItemName = StatsItemName.of('name');
      const asOf: AsOf = AsOf.ofString('2000-01-01').get();
      const value: NumericalValue = NumericalValue.of(10);
      const statsValue: StatsValue = StatsValue.of(statsItemID, asOf, value);

      const statsItem: StatsItem = StatsItem.of(statsItemID, name, StatsValues.ofArray([statsValue]));

      expect(statsItem.getStatsItemID()).toEqual(statsItemID);
      expect(statsItem.getName()).toEqual(name);
      expect(statsItem.getValues().get(0).get()).toEqual(statsValue);
    });
  });

  describe('ofJSON', () => {
    it('normal case', () => {
      const json: StatsItemJSON = {
        statsItemID: '4d0cf4e5-4f48-4db3-9c04-085374d857d1',
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

      const trial: Try<StatsItem, StatsItemError> = StatsItem.ofJSON(json);

      expect(trial.isSuccess()).toEqual(true);
      const statsItem: StatsItem = trial.get();
      expect(statsItem.getStatsItemID().get().get()).toEqual(json.statsItemID);
      expect(statsItem.getName().get()).toEqual(json.name);
      expect(statsItem.getValues().size()).toEqual(json.values.length);
      for (let i: number = 0; i < statsItem.getValues().size(); i++) {
        const statsValue: StatsValue = statsItem.getValues().get(i).get();
        expect(statsValue.getAsOf().toString()).toEqual(AsOf.ofString(json.values[i].asOf).get().toString());
        expect(statsValue.getValue().get()).toEqual(json.values[i].value);
      }
    });

    it('statsItemID is malformat', () => {
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

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const trial: Try<StatsItem, StatsItemError> = StatsItem.ofJSON(json);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsItemError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsItemError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('some asOf is malformat', () => {
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

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const trial: Try<StatsItem, StatsItemError> = StatsItem.ofJSON(json);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsItemError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsItemError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('all asOf are malformat', () => {
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

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const trial: Try<StatsItem, StatsItemError> = StatsItem.ofJSON(json);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsItemError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsItemError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('ofRow', () => {
    it('normal case', () => {
      const row: StatsItemRow = {
        statsItemID: '4d0cf4e5-4f48-4db3-9c04-085374d857d1',
        name: 'name'
      };
      const statsValues: StatsValues = StatsValues.ofArray([
        StatsValue.of(StatsItemID.ofString('4d0cf4e5-4f48-4db3-9c04-085374d857d1').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(10)),
        StatsValue.of(StatsItemID.ofString('4d0cf4e5-4f48-4db3-9c04-085374d857d1').get(), AsOf.ofString('2000-01-02').get(), NumericalValue.of(100)),
        StatsValue.of(StatsItemID.ofString('4d0cf4e5-4f48-4db3-9c04-085374d857d1').get(), AsOf.ofString('2000-01-03').get(), NumericalValue.of(1000))
      ]);

      const trial: Try<StatsItem, StatsItemError> = StatsItem.ofRow(row, statsValues);

      expect(trial.isSuccess()).toEqual(true);
      const statsItem: StatsItem = trial.get();
      expect(statsItem.getStatsItemID().get().get()).toEqual(row.statsItemID);
      expect(statsItem.getName().get()).toEqual(row.name);
      expect(statsItem.getValues().size()).toEqual(statsValues.size());
      for (let i: number = 0; i < statsItem.getValues().size(); i++) {
        const statsValue: StatsValue = statsItem.getValues().get(i).get();
        expect(statsValue.getAsOf()).toEqual(statsValues.get(i).get().getAsOf());
        expect(statsValue.getValue()).toEqual(statsValues.get(i).get().getValue());
      }
    });

    it('statsItemID is malformat', () => {
      const row: StatsItemRow = {
        statsItemID: 'illegal uuid format',
        name: 'name'
      };
      const statsValues: StatsValues = StatsValues.ofArray([
        StatsValue.of(StatsItemID.ofString('4d0cf4e5-4f48-4db3-9c04-085374d857d1').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(10)),
        StatsValue.of(StatsItemID.ofString('4d0cf4e5-4f48-4db3-9c04-085374d857d1').get(), AsOf.ofString('2000-01-02').get(), NumericalValue.of(100)),
        StatsValue.of(StatsItemID.ofString('4d0cf4e5-4f48-4db3-9c04-085374d857d1').get(), AsOf.ofString('2000-01-03').get(), NumericalValue.of(1000))
      ]);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const trial: Try<StatsItem, StatsItemError> = StatsItem.ofRow(row, statsValues);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>((item: StatsItem) => {
        spy1();
        expect(item.getStatsItemID().get().get()).toEqual(row.statsItemID);
      }, (err: StatsItemError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsItemError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('isJSON', () => {
    it('normal case', () => {
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

      expect(StatsItem.isJSON(n)).toEqual(true);
    });

    it('returns false because given parameter is not an object', () => {
      expect(StatsItem.isJSON(null)).toEqual(false);
      expect(StatsItem.isJSON(undefined)).toEqual(false);
      expect(StatsItem.isJSON(56)).toEqual(false);
      expect(StatsItem.isJSON('fjafsd')).toEqual(false);
      expect(StatsItem.isJSON(false)).toEqual(false);
    });

    it('returns false because statsItemID is missing', () => {
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

      expect(StatsItem.isJSON(n)).toEqual(false);
    });

    it('returns false because statsItemID is not string', () => {
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

      expect(StatsItem.isJSON(n)).toEqual(false);
    });

    it('returns false because name is missing', () => {
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

      expect(StatsItem.isJSON(n)).toEqual(false);
    });

    it('returns false because name is not string', () => {
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

      expect(StatsItem.isJSON(n)).toEqual(false);
    });

    it('returns false because values is missing', () => {
      const n: unknown = {
        statsItemID: 'ding dong',
        name: 'cameleon'
      };

      expect(StatsItem.isJSON(n)).toEqual(false);
    });

    it('returns false because values is not array', () => {
      const n: unknown = {
        statsItemID: 'ding dong',
        name: 'cameleon',
        values: {
        }
      };

      expect(StatsItem.isJSON(n)).toEqual(false);
    });
  });

  describe('default', () => {
    it('id will be generated, data are empty', () => {
      const item: StatsItem = StatsItem.default();
      expect(item.getStatsItemID().get().get().length).toEqual(UUID.size());
      expect(item.getName().get()).toEqual('');
      expect(item.getValues().isEmpty()).toEqual(true);
    });
  });
});
