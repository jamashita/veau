/* tslint:disable */
import 'jest';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import { RegionCommand } from '../../veau-command/RegionCommand';
import { Region } from '../../veau-entity/Region';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { VeauMySQL } from '../../veau-infrastructure/VeauMySQL';
import { VeauRedis } from '../../veau-infrastructure/VeauRedis';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { RegionQuery } from '../RegionQuery';

describe('RegionQuery', () => {
  it('allRegions: Redis', async () => {
    const stub: SinonStub = sinon.stub();
    VeauRedis.getString().get = stub;
    stub.resolves('[{"regionID":1,"name":"Afghanistan","iso3166":"AFG"},{"regionID":2,"name":"Albania","iso3166":"ALB"}]');

    const regionQuery: RegionQuery = RegionQuery.getInstance();
    const regions: Array<Region> = await regionQuery.allRegions();

    expect(regions.length).toEqual(2);
    expect(regions[0].getRegionID().get()).toEqual(1);
    expect(regions[0].getName()).toEqual('Afghanistan');
    expect(regions[0].getISO3166().get()).toEqual('AFG');
    expect(regions[1].getRegionID().get()).toEqual(2);
    expect(regions[1].getName()).toEqual('Albania');
    expect(regions[1].getISO3166().get()).toEqual('ALB');
  });

  it('allRegions: MySQL', async () => {
    const stub1: SinonStub = sinon.stub();
    VeauRedis.getString().get = stub1;
    // @ts-ignore
    stub1.resolves(null);
    const stub2: SinonStub = sinon.stub();
    VeauMySQL.execute = stub2;
    stub2.resolves([
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
    const stub3: SinonStub = sinon.stub();
    RegionCommand.prototype.insertAll = stub3;
    stub3.resolves();

    const regionQuery: RegionQuery = RegionQuery.getInstance();
    const regions: Array<Region> = await regionQuery.allRegions();

    expect(regions.length).toEqual(2);
    expect(regions[0].getRegionID().get()).toEqual(1);
    expect(regions[0].getName()).toEqual('Afghanistan');
    expect(regions[0].getISO3166().get()).toEqual('AFG');
    expect(regions[1].getRegionID().get()).toEqual(2);
    expect(regions[1].getName()).toEqual('Albania');
    expect(regions[1].getISO3166().get()).toEqual('ALB');
  });

  it('findByISO3166: Redis', async () => {
    const stub: SinonStub = sinon.stub();
    VeauRedis.getString().get = stub;
    stub.resolves('[{"regionID":1,"name":"Afghanistan","iso3166":"AFG"},{"regionID":2,"name":"Albania","iso3166":"ALB"}]');

    const regionQuery: RegionQuery = RegionQuery.getInstance();
    const region: Region = await regionQuery.findByISO3166(ISO3166.of('ALB'));

    expect(region.getRegionID().get()).toEqual(2);
    expect(region.getName()).toEqual('Albania');
  });

  it('findByISO3166: MySQL', async () => {
    const stub1: SinonStub = sinon.stub();
    VeauRedis.getString().get = stub1;
    // @ts-ignore
    stub1.resolves(null);
    const stub2: SinonStub = sinon.stub();
    VeauMySQL.execute = stub2;
    stub2.resolves([
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
    const stub3: SinonStub = sinon.stub();
    RegionCommand.prototype.insertAll = stub3;
    stub3.resolves();

    const regionQuery: RegionQuery = RegionQuery.getInstance();
    const region: Region = await regionQuery.findByISO3166(ISO3166.of('ALB'));

    expect(region.getRegionID().get()).toEqual(2);
    expect(region.getName()).toEqual('Albania');
  });

  it('findByISO3166: Redis: throws error', () => {
    const stub: SinonStub = sinon.stub();
    VeauRedis.getString().get = stub;
    stub.resolves('[]');

    const regionQuery: RegionQuery = RegionQuery.getInstance();

    expect(regionQuery.findByISO3166(ISO3166.of('ALB'))).rejects.toThrow(NoSuchElementError);
  });

  it('findByISO3166: MySQL: throws error', () => {
    const stub1: SinonStub = sinon.stub();
    VeauRedis.getString().get = stub1;
    // @ts-ignore
    stub1.resolves(null);
    const stub2: SinonStub = sinon.stub();
    VeauMySQL.execute = stub2;
    stub2.resolves([
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
    const stub3: SinonStub = sinon.stub();
    RegionCommand.prototype.insertAll = stub3;
    stub3.resolves();

    const regionQuery: RegionQuery = RegionQuery.getInstance();

    expect(regionQuery.findByISO3166(ISO3166.of('ABA'))).rejects.toThrow(NoSuchElementError);
  });
});
