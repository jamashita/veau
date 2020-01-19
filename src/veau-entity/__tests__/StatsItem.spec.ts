import 'jest';
import { UUID } from '../../veau-general/UUID';
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
      const statsItemID1: StatsItemID = StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0');
      const statsItemID2: StatsItemID = StatsItemID.of('b5f208c3-f171-488f-a8dc-f3798db5f9f4');
      const statsItem1: StatsItem = StatsItem.from(statsItemID1, StatsItemName.of('name 1'), StatsValues.of([]));
      const statsItem2: StatsItem = StatsItem.from(statsItemID2, StatsItemName.of('name 1'), StatsValues.of([]));
      const statsItem3: StatsItem = StatsItem.from(statsItemID1, StatsItemName.of('name 3'), StatsValues.of([StatsValue.of(statsItemID1, AsOf.ofString('2000-01-01'), NumericalValue.of(10))]));

      expect(statsItem1.equals(statsItem1)).toEqual(true);
      expect(statsItem1.equals(statsItem2)).toEqual(false);
      expect(statsItem1.equals(statsItem3)).toEqual(true);
    });
  });

  describe('isSame', () => {
    it('returns true if all the properties are the same', () => {
      const statsItemID1: StatsItemID = StatsItemID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0');
      const statsItemID2: StatsItemID = StatsItemID.of('b5f208c3-f171-488f-a8dc-f3798db5f9f4');
      const statsItem1: StatsItem = StatsItem.from(statsItemID1, StatsItemName.of('name 1'), StatsValues.of([StatsValue.of(statsItemID1, AsOf.ofString('2000-01-01'), NumericalValue.of(10))]));
      const statsItem2: StatsItem = StatsItem.from(statsItemID2, StatsItemName.of('name 1'), StatsValues.of([StatsValue.of(statsItemID2, AsOf.ofString('2000-01-01'), NumericalValue.of(10))]));
      const statsItem3: StatsItem = StatsItem.from(statsItemID1, StatsItemName.of('name 3'), StatsValues.of([StatsValue.of(statsItemID1, AsOf.ofString('2000-01-01'), NumericalValue.of(10))]));
      const statsItem4: StatsItem = StatsItem.from(statsItemID1, StatsItemName.of('name 1'), StatsValues.of([StatsValue.of(statsItemID1, AsOf.ofString('2000-01-01'), NumericalValue.of(10)), StatsValue.of(statsItemID1, AsOf.ofString('2000-01-02'), NumericalValue.of(10))]));
      const statsItem5: StatsItem = StatsItem.from(statsItemID1, StatsItemName.of('name 1'), StatsValues.of([StatsValue.of(statsItemID1, AsOf.ofString('2000-01-02'), NumericalValue.of(10))]));
      const statsItem6: StatsItem = StatsItem.from(statsItemID1, StatsItemName.of('name 1'), StatsValues.of([StatsValue.of(statsItemID1, AsOf.ofString('2000-01-01'), NumericalValue.of(10))]));

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
      const statsItemID: StatsItemID = StatsItemID.of('b5f208c3-f171-488f-a8dc-f3798db5f9f4');
      const statsItem: StatsItem = StatsItem.from(statsItemID, StatsItemName.of('name 1'), StatsValues.of([StatsValue.of(statsItemID, AsOf.ofString('2000-01-01'), NumericalValue.of(10))]));

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
      const statsItemID: StatsItemID = StatsItemID.of('0816ef5e-752d-41ad-b52a-95b1f16e3bbd');
      const asOf1: AsOf = AsOf.ofString('2000-01-01');
      const asOf2: AsOf = AsOf.ofString('2000-01-03');
      const statsItem: StatsItem = StatsItem.from(statsItemID, StatsItemName.of('name 1'), StatsValues.of(
        [
          StatsValue.of(statsItemID, asOf1, NumericalValue.of(1)),
          StatsValue.of(statsItemID, asOf2, NumericalValue.of(3))
        ]
      ));

      expect(statsItem.getAsOfs().size()).toEqual(2);
      expect(statsItem.getAsOfs().get(0)).toEqual(asOf1);
      expect(statsItem.getAsOfs().get(1)).toEqual(asOf2);
    });
  });

  describe('getValuesByColumn', () => {
    it('returns empty string when the date is empty ', () => {
      const statsItemID: StatsItemID = StatsItemID.of('aa28c422-67e2-41e2-bbe6-a97c7d63c44f');
      const column: AsOfs = AsOfs.of([
        AsOf.ofString('2000-01-01'),
        AsOf.ofString('2000-01-02'),
        AsOf.ofString('2000-01-03')
      ]);
      const statsItem: StatsItem = StatsItem.from(statsItemID, StatsItemName.of('name 1'), StatsValues.of([
        StatsValue.of(statsItemID, AsOf.ofString('2000-01-01'), NumericalValue.of(1)),
        StatsValue.of(statsItemID, AsOf.ofString('2000-01-03'), NumericalValue.of(3))
      ]));

      const values: NumericalValues = statsItem.getValuesByColumn(column);

      expect(values.size()).toEqual(3);
      expect(values.get(0).toString()).toEqual('1');
      expect(values.get(1).toString()).toEqual('');
      expect(values.get(2).toString()).toEqual('3');
    });
  });

  describe('isFilled', () => {
    it('returns true if the name is filled', () => {
      const statsItem1: StatsItem = StatsItem.from(StatsItemID.of('5ee0c273-c26f-432f-9217-d6a7b481a073'), StatsItemName.default(), StatsValues.of([]));
      const statsItem2: StatsItem = StatsItem.from(StatsItemID.of('5ee0c273-c26f-432f-9217-d6a7b481a073'), StatsItemName.of('name'), StatsValues.of([]));

      expect(statsItem1.isFilled()).toEqual(false);
      expect(statsItem2.isFilled()).toEqual(true);
    });
  });

  describe('isValid', () => {
    it('returns true if the name is filled', () => {
      const statsItem1: StatsItem = StatsItem.from(StatsItemID.of('5ee0c273-c26f-432f-9217-d6a7b481a073'), StatsItemName.default(), StatsValues.of([]));
      const statsItem2: StatsItem = StatsItem.from(StatsItemID.of('5ee0c273-c26f-432f-9217-d6a7b481a073'), StatsItemName.of('name'), StatsValues.of([]));

      expect(statsItem1.isValid()).toEqual(false);
      expect(statsItem2.isValid()).toEqual(true);
    });
  });

  describe('copy', () => {
    it('evert properties are copied', () => {
      const statsItemID: StatsItemID = StatsItemID.of('5ee0c273-c26f-432f-9217-d6a7b481a073');
      const name: StatsItemName = StatsItemName.of('name');
      const statsValues: StatsValues = StatsValues.of([]);

      const statsItem: StatsItem = StatsItem.from(statsItemID, name, statsValues);
      const copy: StatsItem = statsItem.copy();

      expect(statsItem).not.toBe(copy);
      expect(statsItem.getStatsItemID()).toEqual(statsItemID);
      expect(statsItem.getName()).toEqual(name);
      expect(statsItem.getValues()).toEqual(statsValues);
    });
  });

  describe('from', () => {
    it('normal case', () => {
      const statsItemID: StatsItemID = StatsItemID.of('4d0cf4e5-4f48-4db3-9c04-085374d857d1');
      const name: StatsItemName = StatsItemName.of('name');
      const asOf: AsOf = AsOf.ofString('2000-01-01');
      const value: NumericalValue = NumericalValue.of(10);
      const statsValue: StatsValue = StatsValue.of(statsItemID, asOf, value);

      const statsItem: StatsItem = StatsItem.from(statsItemID, name, StatsValues.of([statsValue]));

      expect(statsItem.getStatsItemID().equals(statsItemID)).toEqual(true);
      expect(statsItem.getName()).toEqual(name);
      expect(statsItem.getValues().get(0)).toEqual(statsValue);
    });
  });

  describe('fromJSON', () => {
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

      const statsItem: StatsItem = StatsItem.fromJSON(json);

      expect(statsItem.getStatsItemID().get()).toEqual(json.statsItemID);
      expect(statsItem.getName().get()).toEqual(json.name);
      expect(statsItem.getValues().size()).toEqual(json.values.length);
      for (let i: number = 0; i < statsItem.getValues().size(); i++) {
        expect(statsItem.getValues().get(i).getAsOf().toString()).toEqual(AsOf.ofString(json.values[i].asOf).toString());
        expect(statsItem.getValues().get(i).getValue().get()).toEqual(json.values[i].value);
      }
    });
  });

  describe('fromRow', () => {
    it('normal case', () => {
      const row: StatsItemRow = {
        statsItemID: '4d0cf4e5-4f48-4db3-9c04-085374d857d1',
        name: 'name'
      };
      const statsValues: StatsValues = StatsValues.of([
        StatsValue.of(StatsItemID.of('4d0cf4e5-4f48-4db3-9c04-085374d857d1'), AsOf.ofString('2000-01-01'), NumericalValue.of(10)),
        StatsValue.of(StatsItemID.of('4d0cf4e5-4f48-4db3-9c04-085374d857d1'), AsOf.ofString('2000-01-02'), NumericalValue.of(100)),
        StatsValue.of(StatsItemID.of('4d0cf4e5-4f48-4db3-9c04-085374d857d1'), AsOf.ofString('2000-01-03'), NumericalValue.of(1000))
      ]);

      const statsItem: StatsItem = StatsItem.fromRow(row, statsValues);

      expect(statsItem.getStatsItemID().get()).toEqual(row.statsItemID);
      expect(statsItem.getName().get()).toEqual(row.name);
      expect(statsItem.getValues().size()).toEqual(statsValues.size());
      for (let i: number = 0; i < statsItem.getValues().size(); i++) {
        expect(statsItem.getValues().get(i).getAsOf()).toEqual(statsValues.get(i).getAsOf());
        expect(statsItem.getValues().get(i).getValue()).toEqual(statsValues.get(i).getValue());
      }
    });
  });

  describe('default', () => {
    it('id will be generated, data are empty', () => {
      const item: StatsItem = StatsItem.default();
      expect(item.getStatsItemID().get().length).toEqual(UUID.size());
      expect(item.getName().get()).toEqual('');
      expect(item.getValues().isEmpty()).toEqual(true);
    });
  });
});
