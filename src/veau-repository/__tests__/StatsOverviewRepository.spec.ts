/* tslint:disable */
import 'jest';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import { StatsOverview } from '../../veau-entity/StatsOverview';
import { VeauMySQL } from '../../veau-infrastructure/VeauMySQL';
import { UUID } from '../../veau-vo/UUID';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
import { StatsOverviewRepository } from '../StatsOverviewRepository';

describe('StatsOverviewRepository', () => {
  it('findByVeauAccountID', async () => {
    const stub: SinonStub = sinon.stub();
    VeauMySQL.query = stub;
    stub.resolves([
      {
        statsID: '1a607fff-12c2-4d8d-a55a-75fa23971393',
        iso639: 'ab',
        iso3166: 'AFG',
        termID: 1,
        name: 'stats overview',
        updatedAt: new Date(2000, 0, 1)
      }
    ]);

    const statsOverviewRepository: StatsOverviewRepository = StatsOverviewRepository.getInstance();
    const statsOverviews: Array<StatsOverview> = await statsOverviewRepository.findByVeauAccountID(VeauAccountID.of(UUID.of('998106de-b2e7-4981-9643-22cd30cd74de')), 0);

    expect(statsOverviews.length).toEqual(1);
    expect(statsOverviews[0].getStatsID().get().get()).toEqual('1a607fff-12c2-4d8d-a55a-75fa23971393');
    expect(statsOverviews[0].getISO639().get()).toEqual('ab');
    expect(statsOverviews[0].getISO3166().get()).toEqual('AFG');
    expect(statsOverviews[0].getTerm().get()).toEqual(1);
    expect(statsOverviews[0].getName()).toEqual('stats overview');
    expect(statsOverviews[0].getUpdatedAt().toDate().getTime()).toEqual(new Date(2000, 0, 1).getTime());
  });
});
