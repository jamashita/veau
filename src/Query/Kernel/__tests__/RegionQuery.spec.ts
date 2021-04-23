import { DataSourceError } from '@jamashita/anden-error';
import { Schrodinger, Superposition } from '@jamashita/genitore-superposition';
import { MySQLError } from '@jamashita/catacombe-mysql';
import { RedisError } from '@jamashita/catacombe-redis';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { MockRegionCommand } from '../../../Command/Mock/MockRegionCommand';
import { kernel } from '../../../Container/Kernel';
import { Type } from '../../../Container/Types';
import { RegionError } from '../../../VO/Region/Error/RegionError';
import { ISO3166 } from '../../../VO/Region/ISO3166';
import { MockISO3166 } from '../../../VO/Region/Mock/MockISO3166';
import { MockRegion } from '../../../VO/Region/Mock/MockRegion';
import { MockRegions } from '../../../VO/Region/Mock/MockRegions';
import { Region } from '../../../VO/Region/Region';
import { Regions } from '../../../VO/Region/Regions';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { MockRegionQuery } from '../../Mock/MockRegionQuery';
import { RegionQuery } from '../RegionQuery';

describe('RegionQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const regionQuery1: RegionQuery = kernel.get<RegionQuery>(Type.RegionKernelQuery);
      const regionQuery2: RegionQuery = kernel.get<RegionQuery>(Type.RegionKernelQuery);

      expect(regionQuery1).toBeInstanceOf(RegionQuery);
      expect(regionQuery1).toBe(regionQuery2);
    });
  });

  describe('all', () => {
    it('regionRedisQuery returns Alive', async () => {
      expect.assertions(2);

      const regions: MockRegions = new MockRegions();

      const regionRedisQuery: MockRegionQuery = new MockRegionQuery();
      const stub: SinonStub = sinon.stub();

      regionRedisQuery.all = stub;
      stub.returns(Superposition.alive<Regions, DataSourceError>(regions, DataSourceError));
      const regionMySQLQuery: MockRegionQuery = new MockRegionQuery();
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();

      const regionQuery: RegionQuery = new RegionQuery(regionMySQLQuery, regionRedisQuery, regionRedisCommand);
      const schrodinger: Schrodinger<Regions, DataSourceError | RegionError> = await regionQuery.all().terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(regions);
    });

    it('regionMySQLQuery returns Alive', async () => {
      expect.assertions(2);

      const regions: MockRegions = new MockRegions();

      const regionRedisQuery: MockRegionQuery = new MockRegionQuery();
      const stub1: SinonStub = sinon.stub();

      regionRedisQuery.all = stub1;
      stub1.returns(Superposition.dead<Regions, MySQLError>(new MySQLError('test faied'), MySQLError));
      const regionMySQLQuery: MockRegionQuery = new MockRegionQuery();
      const stub2: SinonStub = sinon.stub();

      regionMySQLQuery.all = stub2;
      stub2.returns(Superposition.alive<Regions, DataSourceError>(regions, DataSourceError));
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const stub3: SinonStub = sinon.stub();

      regionRedisCommand.insertAll = stub3;
      stub3.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const regionQuery: RegionQuery = new RegionQuery(regionMySQLQuery, regionRedisQuery, regionRedisCommand);
      const schrodinger: Schrodinger<Regions, DataSourceError | RegionError> = await regionQuery.all().terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(regions);
    });

    it('regionRedisQuery nor RegionMySQLQuery returns Dead', async () => {
      expect.assertions(2);

      const regionRedisQuery: MockRegionQuery = new MockRegionQuery();
      const stub1: SinonStub = sinon.stub();

      regionRedisQuery.all = stub1;
      stub1.returns(Superposition.dead<Regions, RedisError>(new RedisError('test failed'), RedisError));
      const regionMySQLQuery: MockRegionQuery = new MockRegionQuery();
      const stub2: SinonStub = sinon.stub();

      regionMySQLQuery.all = stub2;
      stub2.returns(Superposition.dead<Regions, MySQLError>(new MySQLError('test failed'), MySQLError));
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const stub3: SinonStub = sinon.stub();

      regionRedisCommand.insertAll = stub3;
      stub3.returns(Superposition.alive<unknown, DataSourceError>(null, DataSourceError));

      const regionQuery: RegionQuery = new RegionQuery(regionMySQLQuery, regionRedisQuery, regionRedisCommand);
      const schrodinger: Schrodinger<Regions, DataSourceError | RegionError> = await regionQuery.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });

    it('regionCommand returns Dead', async () => {
      expect.assertions(2);

      const regions: MockRegions = new MockRegions();

      const regionRedisQuery: MockRegionQuery = new MockRegionQuery();
      const stub1: SinonStub = sinon.stub();

      regionRedisQuery.all = stub1;
      stub1.returns(Superposition.dead<Regions, RedisError>(new RedisError('test failed'), RedisError));
      const regionMySQLQuery: MockRegionQuery = new MockRegionQuery();
      const stub2: SinonStub = sinon.stub();

      regionMySQLQuery.all = stub2;
      stub2.returns(Superposition.alive<Regions, DataSourceError>(regions, DataSourceError));
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const stub3: SinonStub = sinon.stub();

      regionRedisCommand.insertAll = stub3;
      stub3.returns(Superposition.dead<unknown, RedisError>(new RedisError('test faied'), RedisError));

      const regionQuery: RegionQuery = new RegionQuery(regionMySQLQuery, regionRedisQuery, regionRedisCommand);
      const schrodinger: Schrodinger<Regions, DataSourceError | RegionError> = await regionQuery.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });
  });

  describe('findByISO3166', () => {
    it('normal case', async () => {
      expect.assertions(2);

      const region1: MockRegion = new MockRegion({
        iso3166: new MockISO3166('AFG')
      });
      const region2: MockRegion = new MockRegion({
        iso3166: new MockISO3166('ALB')
      });
      const regions: MockRegions = new MockRegions(region1, region2);

      const regionRedisQuery: MockRegionQuery = new MockRegionQuery();
      const stub: SinonStub = sinon.stub();

      regionRedisQuery.all = stub;
      stub.returns(Superposition.alive<Regions, DataSourceError>(regions, DataSourceError));
      const regionMySQLQuery: MockRegionQuery = new MockRegionQuery();
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();

      const regionQuery: RegionQuery = new RegionQuery(regionMySQLQuery, regionRedisQuery, regionRedisCommand);
      const schrodinger: Schrodinger<Region, DataSourceError | NoSuchElementError | RegionError> = await regionQuery.findByISO3166(ISO3166.of('ALB')).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(regions.get(region2.getRegionID()));
    });

    it('regionQuery.all returns Dead, MySQLError', async () => {
      expect.assertions(2);

      const regionRedisQuery: MockRegionQuery = new MockRegionQuery();
      const stub1: SinonStub = sinon.stub();

      regionRedisQuery.all = stub1;
      stub1.returns(Superposition.dead<Regions, RegionError>(new RegionError('test failed'), RegionError));
      const regionMySQLQuery: MockRegionQuery = new MockRegionQuery();
      const stub2: SinonStub = sinon.stub();

      regionMySQLQuery.all = stub2;
      stub2.returns(Superposition.dead<Regions, MySQLError>(new MySQLError('test failed'), MySQLError));
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();

      const regionQuery: RegionQuery = new RegionQuery(regionMySQLQuery, regionRedisQuery, regionRedisCommand);
      const schrodinger: Schrodinger<Region, DataSourceError | NoSuchElementError | RegionError> = await regionQuery.findByISO3166(ISO3166.of('ALB')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });

    it('regionQuery.all returns Dead, RegionError', async () => {
      expect.assertions(2);

      const regionRedisQuery: MockRegionQuery = new MockRegionQuery();
      const stub1: SinonStub = sinon.stub();

      regionRedisQuery.all = stub1;
      stub1.returns(Superposition.dead<Regions, RegionError>(new RegionError('test failed'), RegionError));
      const regionMySQLQuery: MockRegionQuery = new MockRegionQuery();
      const stub2: SinonStub = sinon.stub();

      regionMySQLQuery.all = stub2;
      stub2.returns(Superposition.dead<Regions, RegionError>(new RegionError('test failed'), RegionError));
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();

      const regionQuery: RegionQuery = new RegionQuery(regionMySQLQuery, regionRedisQuery, regionRedisCommand);
      const schrodinger: Schrodinger<Region, DataSourceError | NoSuchElementError | RegionError> = await regionQuery.findByISO3166(ISO3166.of('ALB')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RegionError);
    });

    it('no match results', async () => {
      expect.assertions(2);

      const regions: MockRegions = new MockRegions(
        new MockRegion({
          iso3166: new MockISO3166('AFG')
        }),
        new MockRegion({
          iso3166: new MockISO3166('ALB')
        })
      );

      const regionRedisQuery: MockRegionQuery = new MockRegionQuery();
      const stub1: SinonStub = sinon.stub();

      regionRedisQuery.all = stub1;
      stub1.returns(Superposition.alive<Regions, DataSourceError>(regions, DataSourceError));
      const regionMySQLQuery: MockRegionQuery = new MockRegionQuery();
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();

      const regionQuery: RegionQuery = new RegionQuery(regionMySQLQuery, regionRedisQuery, regionRedisCommand);
      const schrodinger: Schrodinger<Region, DataSourceError | NoSuchElementError | RegionError> = await regionQuery.findByISO3166(ISO3166.of('AIO')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });
  });
});
