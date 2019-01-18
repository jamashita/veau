import 'jest';
import {Stats, StatsJSON, StatsRow} from '../../veau-entity/Stats';
import {StatsID} from '../../veau-vo/StatsID';
import {StatsItem, StatsItemRow} from '../../veau-vo/StatsItem';
import {Term} from '../../veau-vo/Term';
import {UUID} from '../../veau-vo/UUID';
import {StatsFactory} from '../StatsFactory';

describe('StatsFactory', () => {
  it('from', () => {
    const statsID: StatsID = StatsID.of(UUID.of('4d0cf4e5-4f48-4db3-9c04-085374d857d1'));
    const term: Term = Term.DAILY;
    const name: string = 'name';
    const unit: string = 'unit';
    const seq: number = 1;
    const asOf: string = '2000-01-01';
    const value: number = 10;
    const statsItem: StatsItem = StatsItem.of(asOf, value);

    const statsFactory: StatsFactory = StatsFactory.getInstance();
    const stats: Stats = statsFactory.from(statsID, term, name, unit, seq, [statsItem]);

    expect(stats.getStatsID().equals(statsID)).toEqual(true);
    expect(stats.getTerm().equals(term)).toEqual(true);
    expect(stats.getName()).toEqual(name);
    expect(stats.getUnit()).toEqual(unit);
    expect(stats.getItems()).toEqual([
      statsItem
    ]);
  });

  it('fromJSON', () => {
    const json: StatsJSON = {
      statsID: '4d0cf4e5-4f48-4db3-9c04-085374d857d1',
      termID: 1,
      name: 'name',
      unit: 'unit',
      seq: 1,
      items: [
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

    const statsFactory: StatsFactory = StatsFactory.getInstance();
    const stats: Stats = statsFactory.fromJSON(json);

    expect(stats.getStatsID().get().get()).toEqual(json.statsID);
    expect(stats.getTerm().get()).toEqual(json.termID);
    expect(stats.getName()).toEqual(json.name);
    expect(stats.getUnit()).toEqual(json.unit);
    expect(stats.getSeq()).toEqual(json.seq);
    expect(stats.getItems().length).toEqual(json.items.length);
    for (let i = 0; i < stats.getItems().length; i++) {
      expect(stats.getItems()[i].getAsOf()).toEqual(json.items[i].asOf);
      expect(stats.getItems()[i].getValue()).toEqual(json.items[i].value);
    }
  });

  it('fromRow', () => {
    const row: StatsRow = {
      statsID: '4d0cf4e5-4f48-4db3-9c04-085374d857d1',
      termID: 1,
      name: 'name',
      unit: 'unit',
      seq: 1
    };
    const itemRows: Array<StatsItemRow> = [
      {
        statsID: '4d0cf4e5-4f48-4db3-9c04-085374d857d1',
        asOf: '2000-01-01',
        value: 10
      },
      {
        statsID: '4d0cf4e5-4f48-4db3-9c04-085374d857d1',
        asOf: '2000-01-02',
        value: 100
      },
      {
        statsID: '4d0cf4e5-4f48-4db3-9c04-085374d857d1',
        asOf: '2000-01-03',
        value: 1000
      }
    ];

    const statsFactory: StatsFactory = StatsFactory.getInstance();
    const stats: Stats = statsFactory.fromRow(row, itemRows);

    expect(stats.getStatsID().get().get()).toEqual(row.statsID);
    expect(stats.getTerm().get()).toEqual(row.termID);
    expect(stats.getName()).toEqual(row.name);
    expect(stats.getUnit()).toEqual(row.unit);
    expect(stats.getSeq()).toEqual(row.seq);
    expect(stats.getItems().length).toEqual(itemRows.length);
    for(let i = 0; i < stats.getItems().length; i++) {
      expect(stats.getItems()[i].getAsOf()).toEqual(itemRows[i].asOf);
      expect(stats.getItems()[i].getValue()).toEqual(itemRows[i].value);
    }
  });
});
