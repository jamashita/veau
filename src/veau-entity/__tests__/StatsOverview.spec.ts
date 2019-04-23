/* tslint:disable */
import 'jest';
import * as moment from 'moment';
import { Term } from '../../veau-enum/Term';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { StatsID } from '../../veau-vo/StatsID';
import { UUID } from '../../veau-vo/UUID';
import { StatsOverview } from '../StatsOverview';

describe('StatsOverview', () => {
  it('equals', () => {
    const statsOverView1: StatsOverview = new StatsOverview(StatsID.of(UUID.of('1a607fff-12c2-4d8d-a55a-75fa23971393')), ISO639.of('ab'), ISO3166.of('AFG'), Term.DAILY, 'stats overview 1', 'unit1', moment('2000-01-01'));
    const statsOverView2: StatsOverview = new StatsOverview(StatsID.of(UUID.of('d7c3437f-8c1f-4542-abef-bd25d900039e')), ISO639.of('ab'), ISO3166.of('AFG'), Term.DAILY, 'stats overview 1', 'unit1', moment('2000-01-01'));
    const statsOverView3: StatsOverview = new StatsOverview(StatsID.of(UUID.of('1a607fff-12c2-4d8d-a55a-75fa23971393')), ISO639.of('aa'), ISO3166.of('ALB'), Term.WEEKLY, 'stats overview 2', 'unit2', moment('2000-01-02'));

    expect(statsOverView1.equals(statsOverView1)).toEqual(true);
    expect(statsOverView1.equals(statsOverView2)).toEqual(false);
    expect(statsOverView1.equals(statsOverView3)).toEqual(true);
  });

  it('toJSON', () => {
    const statsOverView: StatsOverview = new StatsOverview(StatsID.of(UUID.of('1a607fff-12c2-4d8d-a55a-75fa23971393')), ISO639.of('ab'), ISO3166.of('AFG'), Term.DAILY, 'stats overview', 'unit', moment.utc('2000-01-01'));

    expect(statsOverView.toJSON()).toEqual({
      statsID: '1a607fff-12c2-4d8d-a55a-75fa23971393',
      iso639: 'ab',
      iso3166: 'AFG',
      termID: 1,
      name: 'stats overview',
      unit: 'unit',
      updatedAt: '2000-01-01 00:00:00'
    });
  });

  it('copy', () => {
    const statsID: StatsID = StatsID.of(UUID.of('1a607fff-12c2-4d8d-a55a-75fa23971393'));
    const iso639: ISO639 = ISO639.of('ab');
    const iso3166: ISO3166 = ISO3166.of('AFG');
    const term: Term = Term.DAILY;
    const name: string = 'stats overview';
    const unit: string = 'unit';
    const updatedAt: moment.Moment = moment('2000-01-01');

    const statsOverView: StatsOverview = new StatsOverview(statsID, iso639, iso3166, term, name, unit, updatedAt);
    const copy: StatsOverview = statsOverView.copy();

    expect(statsOverView).not.toBe(copy);
    expect(statsOverView.getStatsID()).toEqual(statsID);
    expect(statsOverView.getISO639()).toEqual(iso639);
    expect(statsOverView.getISO3166()).toEqual(iso3166);
    expect(statsOverView.getTerm()).toEqual(term);
    expect(statsOverView.getName()).toEqual(name);
    expect(statsOverView.getUnit()).toEqual(unit);
    expect(statsOverView.getUpdatedAt().isSame(updatedAt)).toEqual(true);
  });
});
