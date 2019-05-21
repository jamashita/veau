import 'jest';
import * as moment from 'moment';
import { StatsValues } from '../../veau-collection/StatsValues';
import { StatsItemID } from '../../veau-vo/StatsItemID';
import { StatsValue } from '../../veau-vo/StatsValue';
import { UUID } from '../../veau-vo/UUID';
import { StatsItem } from '../StatsItem';

describe('StatsItem', () => {
  describe('equals', () => {
    it('returns true when the ids equal', () => {
      const statsItemID1: StatsItemID = StatsItemID.of(UUID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0'));
      const statsItemID2: StatsItemID = StatsItemID.of(UUID.of('b5f208c3-f171-488f-a8dc-f3798db5f9f4'));
      const statsItem1: StatsItem = new StatsItem(statsItemID1, 'name 1', new StatsValues([]));
      const statsItem2: StatsItem = new StatsItem(statsItemID2, 'name 1', new StatsValues([]));
      const statsItem3: StatsItem = new StatsItem(statsItemID1, 'name 3', new StatsValues([StatsValue.of(moment('2000-01-01'), 10)]));

      expect(statsItem1.equals(statsItem1)).toEqual(true);
      expect(statsItem1.equals(statsItem2)).toEqual(false);
      expect(statsItem1.equals(statsItem3)).toEqual(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const statsItemID: StatsItemID = StatsItemID.of(UUID.of('b5f208c3-f171-488f-a8dc-f3798db5f9f4'));
      const statsItem: StatsItem = new StatsItem(statsItemID, 'name 1', new StatsValues([StatsValue.of(moment('2000-01-01'), 10)]));

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
    it('extract only their asOfs', () => {
      const asOf1: moment.Moment = moment('2000-01-01');
      const asOf2: moment.Moment = moment('2000-01-03');
      const statsItem: StatsItem = new StatsItem(StatsItemID.of(UUID.of('0816ef5e-752d-41ad-b52a-95b1f16e3bbd')), 'name 1', new StatsValues(
        [
          StatsValue.of(asOf1, 1),
          StatsValue.of(asOf2, 3)
        ]
      ));

      expect(statsItem.getAsOfs()).toEqual([
        asOf1,
        asOf2
      ]);
    });
  });

  describe('getValuesByColumn', () => {
    it('returns empty string when the date is empty ', () => {
      const column: Array<string> = ['2000-01-01', '2000-01-02', '2000-01-03'];
      const statsItem: StatsItem = new StatsItem(StatsItemID.of(UUID.of('aa28c422-67e2-41e2-bbe6-a97c7d63c44f')), 'name 1', new StatsValues([
        StatsValue.of(moment('2000-01-01'), 1),
        StatsValue.of(moment('2000-01-03'), 3)
      ]));

      expect(statsItem.getValuesByColumn(column)).toEqual([
        '1',
        '',
        '3'
      ]);
    });
  });

  describe('isFilled', () => {
    it('returns true if the name is filled', () => {
      const statsItem1: StatsItem = new StatsItem(StatsItemID.of(UUID.of('5ee0c273-c26f-432f-9217-d6a7b481a073')), '', new StatsValues([]));
      const statsItem2: StatsItem = new StatsItem(StatsItemID.of(UUID.of('5ee0c273-c26f-432f-9217-d6a7b481a073')), 'name', new StatsValues([]));

      expect(statsItem1.isFilled()).toEqual(false);
      expect(statsItem2.isFilled()).toEqual(true);
    });
  });

  describe('isValid', () => {
    it('returns true if the name is filled', () => {
      const statsItem1: StatsItem = new StatsItem(StatsItemID.of(UUID.of('5ee0c273-c26f-432f-9217-d6a7b481a073')), '', new StatsValues([]));
      const statsItem2: StatsItem = new StatsItem(StatsItemID.of(UUID.of('5ee0c273-c26f-432f-9217-d6a7b481a073')), 'name', new StatsValues([]));

      expect(statsItem1.isValid()).toEqual(false);
      expect(statsItem2.isValid()).toEqual(true);
    });
  });

  describe('copy', () => {
    it('evert properties are copied', () => {
      const statsItemID: StatsItemID = StatsItemID.of(UUID.of('5ee0c273-c26f-432f-9217-d6a7b481a073'));
      const name: string = 'name';
      const statsValues: StatsValues = new StatsValues([]);

      const statsItem: StatsItem = new StatsItem(statsItemID, name, statsValues);
      const copy: StatsItem = statsItem.copy();

      expect(statsItem).not.toBe(copy);
      expect(statsItem.getStatsItemID()).toEqual(statsItemID);
      expect(statsItem.getName()).toEqual(name);
      expect(statsItem.getValues()).toEqual(statsValues);
    });
  });
});
