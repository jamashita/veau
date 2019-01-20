/* tslint:disable */
import 'jest';
import * as moment from 'moment';
import { StatsItem, StatsItemJSON, StatsItemRow } from '../../veau-entity/StatsItem';
import { StatsItemID } from '../../veau-vo/StatsItemID';
import { StatsValue } from '../../veau-vo/StatsValue';
import { Term } from '../../veau-vo/Term';
import { UUID } from '../../veau-vo/UUID';
import { StatsItemFactory } from '../StatsItemFactory';

describe('StatsItemFactory', () => {
  it('from', () => {
    const statsItemID: StatsItemID = StatsItemID.of(UUID.of('4d0cf4e5-4f48-4db3-9c04-085374d857d1'));
    const term: Term = Term.DAILY;
    const name: string = 'name';
    const unit: string = 'unit';
    const seq: number = 1;
    const asOf: string = '2000-01-01';
    const value: number = 10;
    const statsValue: StatsValue = StatsValue.of(moment(asOf), value);

    const statsItemFactory: StatsItemFactory = StatsItemFactory.getInstance();
    const statsItem: StatsItem = statsItemFactory.from(statsItemID, term, name, unit, seq, [statsValue]);

    expect(statsItem.getStatsItemID().equals(statsItemID)).toEqual(true);
    expect(statsItem.getTerm().equals(term)).toEqual(true);
    expect(statsItem.getName()).toEqual(name);
    expect(statsItem.getUnit()).toEqual(unit);
    expect(statsItem.getValues()).toEqual([
      statsValue
    ]);
  });

  it('fromJSON', () => {
    const json: StatsItemJSON = {
      statsItemID: '4d0cf4e5-4f48-4db3-9c04-085374d857d1',
      termID: 1,
      name: 'name',
      unit: 'unit',
      seq: 1,
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
    expect(statsItem.getTerm().get()).toEqual(json.termID);
    expect(statsItem.getName()).toEqual(json.name);
    expect(statsItem.getUnit()).toEqual(json.unit);
    expect(statsItem.getSeq()).toEqual(json.seq);
    expect(statsItem.getValues().length).toEqual(json.values.length);
    for (let i = 0; i < statsItem.getValues().length; i++) {
      expect(statsItem.getValues()[i].getAsOf().get('days')).toEqual(moment.utc(json.values[i].asOf).get('days'));
      expect(statsItem.getValues()[i].getValue()).toEqual(json.values[i].value);
    }
  });

  it('fromRow', () => {
    const row: StatsItemRow = {
      statsItemID: '4d0cf4e5-4f48-4db3-9c04-085374d857d1',
      termID: 1,
      name: 'name',
      unit: 'unit',
      seq: 1
    };
    const statsValues: Array<StatsValue> = [
      StatsValue.of(moment('2000-01-01'), 10),
      StatsValue.of(moment('2000-01-02'), 100),
      StatsValue.of(moment('2000-01-03'), 1000)
    ];

    const statsItemFactory: StatsItemFactory = StatsItemFactory.getInstance();
    const statsItem: StatsItem = statsItemFactory.fromRow(row, statsValues);

    expect(statsItem.getStatsItemID().get().get()).toEqual(row.statsItemID);
    expect(statsItem.getTerm().get()).toEqual(row.termID);
    expect(statsItem.getName()).toEqual(row.name);
    expect(statsItem.getUnit()).toEqual(row.unit);
    expect(statsItem.getSeq()).toEqual(row.seq);
    expect(statsItem.getValues().length).toEqual(statsValues.length);
    for (let i = 0; i < statsItem.getValues().length; i++) {
      expect(statsItem.getValues()[i].getAsOf()).toEqual(statsValues[i].getAsOf());
      expect(statsItem.getValues()[i].getValue()).toEqual(statsValues[i].getValue());
    }
  });
});
