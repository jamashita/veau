/* tslint:disable */
import 'jest';
import { SinonSpy, SinonStub } from 'sinon';
import * as sinon from 'sinon';
import { NoSuchElementError } from '../../veau-general/NoSuchElementError';
import { VeauMySQL } from '../../veau-infrastructure/VeauMySQL';
import { VeauRedis } from '../../veau-infrastructure/VeauRedis';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { Region } from '../../veau-vo/Region';
import { RegionRepository } from '../RegionRepository';

describe('RegionRepository', () => {
  it('all: Redis has regions', async () => {
    const stub: SinonStub = sinon.stub();
    VeauRedis.getString().get = stub;
    stub.returns('[{"regionID":1,"name":"Afghanistan","iso3166":"AFG"},{"regionID":2,"name":"Albania","iso3166":"ALB"}]');
    const regionRepository: RegionRepository = RegionRepository.getInstance();
    const regions: Array<Region> = await regionRepository.all();

    expect(regions.length).toEqual(2);
    expect(regions[0].getRegionID().get()).toEqual(1);
    expect(regions[0].getName()).toEqual('Afghanistan');
    expect(regions[0].getISO3166().get()).toEqual('AFG');
    expect(regions[1].getRegionID().get()).toEqual(2);
    expect(regions[1].getName()).toEqual('Albania');
    expect(regions[1].getISO3166().get()).toEqual('ALB');
  });

  it('all: Redis does not have regions', async () => {
    const stub1: SinonStub = sinon.stub();
    VeauRedis.getString().get = stub1;
    stub1.returns(null);
    const stub2: SinonStub = sinon.stub();
    VeauMySQL.query = stub2;
    stub2.returns([
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
    const spy: SinonSpy = sinon.spy();
    VeauRedis.getString().set = spy;
    const regionRepository: RegionRepository = RegionRepository.getInstance();
    const regions: Array<Region> = await regionRepository.all();

    expect(regions.length).toEqual(2);
    expect(regions[0].getRegionID().get()).toEqual(1);
    expect(regions[0].getName()).toEqual('Afghanistan');
    expect(regions[0].getISO3166().get()).toEqual('AFG');
    expect(regions[1].getRegionID().get()).toEqual(2);
    expect(regions[1].getName()).toEqual('Albania');
    expect(regions[1].getISO3166().get()).toEqual('ALB');
    expect(spy.called).toEqual(true);
  });

  it('findByISO3166', async () => {
    const stub: SinonStub = sinon.stub();
    VeauRedis.getString().get = stub;
    stub.returns('[{"regionID":1,"name":"Afghanistan","iso3166":"AFG"},{"regionID":2,"name":"Albania","iso3166":"ALB"}]');
    const regionRepository: RegionRepository = RegionRepository.getInstance();
    const region: Region = await regionRepository.findByISO3166(ISO3166.of('ALB'));

    expect(region.getRegionID().get()).toEqual(2);
    expect(region.getName()).toEqual('Albania');
  });

  it('findByISO3166: throws error', () => {
    const stub: SinonStub = sinon.stub();
    VeauRedis.getString().get = stub;
    stub.returns('[]');
    const regionRepository: RegionRepository = RegionRepository.getInstance();

    expect(regionRepository.findByISO3166(ISO3166.of('ALB'))).rejects.toThrow(NoSuchElementError);
  });
});
