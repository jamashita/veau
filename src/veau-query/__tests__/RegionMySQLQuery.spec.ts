/* tslint:disable */
import 'jest';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { VeauMySQL } from '../../veau-infrastructure/VeauMySQL';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { Region } from '../../veau-vo/Region';
import { RegionMySQLQuery } from '../RegionMySQLQuery';

describe('RegionMySQLQuery', () => {
  it('allRegions', async () => {
    const stub: SinonStub = sinon.stub();
    VeauMySQL.query = stub;
    stub.resolves([
      {
        regionID: 1,
        name: 'Afghanistan',
        iso3166: 'AFG'
      },
      {
        regionID: 2,
        name: 'Albania',
        iso3166: 'ALB'
      }
    ]);
    const regionQuery: RegionMySQLQuery = RegionMySQLQuery.getInstance();
    const regions: Array<Region> = await regionQuery.allRegions();

    expect(regions.length).toEqual(2);
    expect(regions[0].getRegionID().get()).toEqual(1);
    expect(regions[0].getName()).toEqual('Afghanistan');
    expect(regions[0].getISO3166().get()).toEqual('AFG');
    expect(regions[1].getRegionID().get()).toEqual(2);
    expect(regions[1].getName()).toEqual('Albania');
    expect(regions[1].getISO3166().get()).toEqual('ALB');
  });

  it('findByISO3166', async () => {
    const stub: SinonStub = sinon.stub();
    VeauMySQL.query = stub;
    stub.resolves([
      {
        regionID: 1,
        name: 'Afghanistan',
        iso3166: 'AFG'
      },
      {
        regionID: 2,
        name: 'Albania',
        iso3166: 'ALB'
      }
    ]);
    const regionQuery: RegionMySQLQuery = RegionMySQLQuery.getInstance();
    const region: Region = await regionQuery.findByISO3166(ISO3166.of('ALB'));

    expect(region.getRegionID().get()).toEqual(2);
    expect(region.getName()).toEqual('Albania');
  });

  it('findByISO3166: throws error', () => {
    const stub: SinonStub = sinon.stub();
    VeauMySQL.query = stub;
    stub.resolves([
      {
        regionID: 1,
        name: 'Afghanistan',
        iso3166: 'AFG'
      },
      {
        regionID: 2,
        name: 'Albania',
        iso3166: 'ALB'
      }
    ]);
    const regionQuery: RegionMySQLQuery = RegionMySQLQuery.getInstance();

    expect(regionQuery.findByISO3166(ISO3166.of('ALB'))).rejects.toThrow(NoSuchElementError);
  });
});
