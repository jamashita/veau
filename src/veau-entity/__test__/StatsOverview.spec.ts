/* tslint:disable */
import 'jest';
import * as moment from 'moment';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { StatsID } from '../../veau-vo/StatsID';
import { UUID } from '../../veau-vo/UUID';
import { StatsOverview } from '../StatsOverview';

describe('StatsOverview', () => {
  it('equals', () => {
    const statsOverView1: StatsOverview = new StatsOverview(StatsID.of(UUID.of('1a607fff-12c2-4d8d-a55a-75fa23971393')), ISO639.of('ab'), ISO3166.of('AFG'), 'stats overview 1', moment.utc('2000-01-01'));
    const statsOverView2: StatsOverview = new StatsOverview(StatsID.of(UUID.of('d7c3437f-8c1f-4542-abef-bd25d900039e')), ISO639.of('ab'), ISO3166.of('AFG'), 'stats overview 1', moment.utc('2000-01-01'));
    const statsOverView3: StatsOverview = new StatsOverview(StatsID.of(UUID.of('1a607fff-12c2-4d8d-a55a-75fa23971393')), ISO639.of('aa'), ISO3166.of('ALB'), 'stats overview 2', moment.utc('2000-01-02'));

    expect(statsOverView1.equals(statsOverView1)).toEqual(true);
    expect(statsOverView1.equals(statsOverView2)).toEqual(false);
    expect(statsOverView1.equals(statsOverView3)).toEqual(true);
  });

  it('toJSON', () => {
    const statsOverView: StatsOverview = new StatsOverview(StatsID.of(UUID.of('1a607fff-12c2-4d8d-a55a-75fa23971393')), ISO639.of('ab'), ISO3166.of('AFG'), 'stats overview', moment.utc('2000-01-01'));

    expect(statsOverView.toJSON()).toEqual({
      statsID: '1a607fff-12c2-4d8d-a55a-75fa23971393',
      iso639: 'ab',
      iso3166: 'AFG',
      name: 'stats overview',
      updatedAt: '2000-01-01T00:00:00.000'
    });
  });
});
