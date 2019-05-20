/* tslint:disable */
import 'jest';
import * as moment from 'moment';
import { StatsValues } from '../../veau-collection/StatsValues';
import { StatsItem, StatsItemJSON, StatsItemRow } from '../../veau-entity/StatsItem';
import { StatsItemID } from '../../veau-vo/StatsItemID';
import { StatsValue } from '../../veau-vo/StatsValue';
import { UUID } from '../../veau-vo/UUID';
import { StatsItemFactory } from '../StatsItemFactory';

describe('StatsItemFactory', () => {
  describe('from', () => {
    it('normal case', () => {
      const statsItemID: StatsItemID = StatsItemID.of(UUID.of('4d0cf4e5-4f48-4db3-9c04-085374d857d1'));
      const name: string = 'name';
      const asOf: string = '2000-01-01';
      const value: number = 10;
      const statsValue: StatsValue = StatsValue.of(moment(asOf), value);

      const statsItemFactory: StatsItemFactory = StatsItemFactory.getInstance();
      const statsItem: StatsItem = statsItemFactory.from(statsItemID, name, new StatsValues([statsValue]));

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

      const statsItemFactory: StatsItemFactory = StatsItemFactory.getInstance();
      const statsItem: StatsItem = statsItemFactory.fromJSON(json);

      expect(statsItem.getStatsItemID().get().get()).toEqual(json.statsItemID);
      expect(statsItem.getName()).toEqual(json.name);
      expect(statsItem.getValues().length()).toEqual(json.values.length);
      for (let i = 0; i < statsItem.getValues().length(); i++) {
        expect(statsItem.getValues().get(i).getAsOf().get('days')).toEqual(moment(json.values[i].asOf).get('days'));
        expect(statsItem.getValues().get(i).getValue()).toEqual(json.values[i].value);
      }
    });
  });

  describe('fromRow', () => {
    it('normal case', () => {
      const row: StatsItemRow = {
        statsItemID: '4d0cf4e5-4f48-4db3-9c04-085374d857d1',
        name: 'name'
      };
      const statsValues: StatsValues = new StatsValues([
        StatsValue.of(moment('2000-01-01'), 10),
        StatsValue.of(moment('2000-01-02'), 100),
        StatsValue.of(moment('2000-01-03'), 1000)
      ]);

      const statsItemFactory: StatsItemFactory = StatsItemFactory.getInstance();
      const statsItem: StatsItem = statsItemFactory.fromRow(row, statsValues);

      expect(statsItem.getStatsItemID().get().get()).toEqual(row.statsItemID);
      expect(statsItem.getName()).toEqual(row.name);
      expect(statsItem.getValues().length).toEqual(statsValues.length);
      for (let i = 0; i < statsItem.getValues().length(); i++) {
        expect(statsItem.getValues().get(i).getAsOf()).toEqual(statsValues.get(i).getAsOf());
        expect(statsItem.getValues().get(i).getValue()).toEqual(statsValues.get(i).getValue());
      }
    });
  });
});
