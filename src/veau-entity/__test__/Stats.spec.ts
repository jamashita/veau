/* tslint:disable */
import 'jest';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsItem } from '../../veau-vo/StatsItem';
import { Term } from '../../veau-vo/Term';
import { UUID } from '../../veau-vo/UUID';
import { Stats } from '../Stats';

describe('Stats', () => {
  it('equals', () => {
    const statsID1: StatsID = StatsID.of(UUID.of('f186dad1-6170-4fdc-9020-d73d9bf86fb0'));
    const statsID2: StatsID = StatsID.of(UUID.of('b5f208c3-f171-488f-a8dc-f3798db5f9f4'));
    const stats1: Stats = new Stats(statsID1, Term.DAILY, 'name 1', 'unit 1', 1, []);
    const stats2: Stats = new Stats(statsID2, Term.DAILY, 'name 1', 'unit 1', 1, []);
    const stats3: Stats = new Stats(statsID1, Term.ANNUAL, 'name 3', 'unit 3', 2, [StatsItem.of('2000-01-01', 10)]);

    expect(stats1.equals(stats1)).toEqual(true);
    expect(stats1.equals(stats2)).toEqual(false);
    expect(stats1.equals(stats3)).toEqual(true);
  });

  it('toJSON', () => {
    const statsID: StatsID = StatsID.of(UUID.of('b5f208c3-f171-488f-a8dc-f3798db5f9f4'));
    const stats: Stats = new Stats(statsID, Term.DAILY, 'name 1', 'unit 1', 1, [StatsItem.of('2000-01-01', 10)]);

    expect(stats.toJSON()).toEqual({
      statsID: 'b5f208c3-f171-488f-a8dc-f3798db5f9f4',
      termID: 1,
      name: 'name 1',
      unit: 'unit 1',
      seq: 1,
      items: [
        {
          asOf: '2000-01-01',
          value: 10
        }
      ]
    });
  });
});
