import { DataSourceError } from '@jamashita/catacombe-datasource';
import { MySQLError } from '@jamashita/catacombe-mysql';
import { RedisError } from '@jamashita/catacombe-redis';
import { Schrodinger, Superposition } from '@jamashita/genitore';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { cask } from '../../../../container/Cask';
import { Type } from '../../../../container/Types';
import { RegionError } from '../../../../domain/vo/Region/error/RegionError';
import { ISO3166 } from '../../../../domain/vo/Region/ISO3166';
import { MockISO3166 } from '../../../../domain/vo/Region/mock/MockISO3166';
import { MockRegion } from '../../../../domain/vo/Region/mock/MockRegion';
import { Region } from '../../../../domain/vo/Region/Region';
import { Regions } from '../../../../domain/vo/Region/Regions';
import { MockRegionCommand } from '../../../command/mock/MockRegionCommand';
import { NoSuchElementError } from '../../error/NoSuchElementError';
import { MockRegionQuery } from '../../mock/MockRegionQuery';
import { RegionQuery } from '../RegionQuery';

describe('RegionQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const regionQuery1: RegionQuery = cask.get<RegionQuery>(Type.RegionCaskQuery);
      const regionQuery2: RegionQuery = cask.get<RegionQuery>(Type.RegionCaskQuery);

      expect(regionQuery1).toBeInstanceOf(RegionQuery);
      expect(regionQuery1).toBe(regionQuery2);
    });
  });

  describe('all', () => {
    it('regionRedisQuery returns Alive', async () => {
      expect.assertions(2);

      const regions: Regions = Regions.empty();

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

      const regions: Regions = Regions.empty();

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

      const regions: Regions = Regions.empty();

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
      const regions: Regions = Regions.ofSpread(region1, region2);

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

      const regions: Regions = Regions.ofSpread(
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
