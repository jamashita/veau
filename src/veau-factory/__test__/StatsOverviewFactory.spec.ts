/* tslint:disable */
import 'jest';
import * as moment from 'moment';
import { StatsOverview, StatsOverviewJSON, StatsOverviewRow } from '../../veau-entity/StatsOverview';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { StatsID } from '../../veau-vo/StatsID';
import { Term } from '../../veau-enum/Term';
import { UUID } from '../../veau-vo/UUID';
import { StatsOverviewFactory } from '../StatsOverviewFactory';

describe('StatsOverviewFactory', () => {
  it('from', () => {
    const statsID: StatsID = StatsID.of(UUID.of('1a607fff-12c2-4d8d-a55a-75fa23971393'));
    const iso639: ISO639 = ISO639.of('ab');
    const iso3166: ISO3166 = ISO3166.of('AFG');
    const term: Term = Term.DAILY;
    const name: string = 'stats overview';
    const updatedAt: moment.Moment = moment.utc('2000-01-01');

    const statsOverviewFactory: StatsOverviewFactory = StatsOverviewFactory.getInstance();
    const statsOverview: StatsOverview = statsOverviewFactory.from(statsID, iso639, iso3166, term, name, updatedAt);

    expect(statsOverview.getStatsID().equals(statsID)).toEqual(true);
    expect(statsOverview.getISO639().equals(iso639)).toEqual(true);
    expect(statsOverview.getISO3166().equals(iso3166)).toEqual(true);
    expect(statsOverview.getTerm()).toEqual(term);
    expect(statsOverview.getName()).toEqual(name);
    expect(statsOverview.getUpdatedAt().get('days')).toEqual(updatedAt.get('days'));
  });

  it('fromJSON', () => {
    const json: StatsOverviewJSON = {
      statsID: '1a607fff-12c2-4d8d-a55a-75fa23971393',
      iso639: 'ab',
      iso3166: 'AFG',
      termID: 2,
      name: 'stats overview',
      updatedAt: '2000-01-01T00:00:00.000'
    };

    const statsOverviewFactory: StatsOverviewFactory = StatsOverviewFactory.getInstance();
    const statsOverview: StatsOverview = statsOverviewFactory.fromJSON(json);

    expect(statsOverview.getStatsID().get().get()).toEqual(json.statsID);
    expect(statsOverview.getISO639().get()).toEqual(json.iso639);
    expect(statsOverview.getISO3166().get()).toEqual(json.iso3166);
    expect(statsOverview.getTerm().get()).toEqual(json.termID);
    expect(statsOverview.getName()).toEqual(json.name);
    expect(statsOverview.getUpdatedAt().format('YYYY-MM-DDTHH:mm:ss.SSS')).toEqual(json.updatedAt);
  });

  it('fromRow', () => {
    const row: StatsOverviewRow = {
      statsID: '1a607fff-12c2-4d8d-a55a-75fa23971393',
      iso639: 'ab',
      iso3166: 'AFG',
      termID: 3,
      name: 'stats overview',
      updatedAt: new Date(2000, 1, 1)
    };

    const statsOverviewFactory: StatsOverviewFactory = StatsOverviewFactory.getInstance();
    const statsOverview: StatsOverview = statsOverviewFactory.fromRow(row);

    expect(statsOverview.getStatsID().get().get()).toEqual(row.statsID);
    expect(statsOverview.getISO639().get()).toEqual(row.iso639);
    expect(statsOverview.getISO3166().get()).toEqual(row.iso3166);
    expect(statsOverview.getTerm().get()).toEqual(row.termID);
    expect(statsOverview.getName()).toEqual(row.name);
    expect(statsOverview.getUpdatedAt().toDate().getTime()).toEqual(row.updatedAt.getTime());
  });
});
