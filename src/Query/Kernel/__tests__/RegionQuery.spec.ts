import 'reflect-metadata';

import { Alive, DataSourceError, Dead, MySQLError, RedisError, Superposition } from 'publikum';
import sinon, { SinonSpy, SinonStub } from 'sinon';

import { MockRegionCommand } from '../../../Command/Mock/MockRegionCommand';
import { kernel } from '../../../Container/Kernel';
import { TYPE } from '../../../Container/Types';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { RegionError } from '../../../VO/Region/Error/RegionError';
import { RegionsError } from '../../../VO/Region/Error/RegionsError';
import { ISO3166 } from '../../../VO/Region/ISO3166';
import { MockISO3166 } from '../../../VO/Region/Mock/MockISO3166';
import { MockRegion } from '../../../VO/Region/Mock/MockRegion';
import { MockRegions } from '../../../VO/Region/Mock/MockRegions';
import { Region } from '../../../VO/Region/Region';
import { Regions } from '../../../VO/Region/Regions';
import { MockRegionQuery } from '../../Mock/MockRegionQuery';
import { RegionQuery } from '../RegionQuery';

describe('RegionQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const regionQuery1: RegionQuery = kernel.get<RegionQuery>(TYPE.RegionKernelQuery);
      const regionQuery2: RegionQuery = kernel.get<RegionQuery>(TYPE.RegionKernelQuery);

      expect(regionQuery1).toBeInstanceOf(RegionQuery);
      expect(regionQuery1).toBe(regionQuery2);
    });
  });

  describe('all', () => {
    it('RegionRedisQuery returns Alive', async () => {
      const regions: MockRegions = new MockRegions();

      const regionRedisQuery: MockRegionQuery = new MockRegionQuery();
      const stub: SinonStub = sinon.stub();
      regionRedisQuery.all = stub;
      stub.resolves(Alive.of<Regions, NoSuchElementError>(regions));
      const regionMySQLQuery: MockRegionQuery = new MockRegionQuery();
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();

      const regionQuery: RegionQuery = new RegionQuery(regionMySQLQuery, regionRedisQuery, regionRedisCommand);
      const superposition: Superposition<Regions, RegionsError | DataSourceError> = await regionQuery.all();

      expect(superposition.isAlive()).toBe(true);
      expect(superposition.get()).toBe(regions);
    });

    it('RegionMySQLQuery returns Alive', async () => {
      const regions: MockRegions = new MockRegions();

      const regionRedisQuery: MockRegionQuery = new MockRegionQuery();
      const stub1: SinonStub = sinon.stub();
      regionRedisQuery.all = stub1;
      stub1.resolves(Dead.of<Regions, DataSourceError>(new MySQLError('test faied')));
      const regionMySQLQuery: MockRegionQuery = new MockRegionQuery();
      const stub2: SinonStub = sinon.stub();
      regionMySQLQuery.all = stub2;
      stub2.resolves(Alive.of<Regions, NoSuchElementError>(regions));
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const stub3: SinonStub = sinon.stub();
      regionRedisCommand.insertAll = stub3;
      stub3.resolves(Alive.of<DataSourceError>());

      const regionQuery: RegionQuery = new RegionQuery(regionMySQLQuery, regionRedisQuery, regionRedisCommand);
      const superposition: Superposition<Regions, RegionsError | DataSourceError> = await regionQuery.all();

      expect(superposition.isAlive()).toBe(true);
      expect(superposition.get()).toBe(regions);
    });

    it('RegionRedisQuery nor RegionMySQLQuery returns Dead', async () => {
      const regionRedisQuery: MockRegionQuery = new MockRegionQuery();
      const stub1: SinonStub = sinon.stub();
      regionRedisQuery.all = stub1;
      stub1.resolves(Dead.of<Regions, RedisError>(new RedisError('test failed')));
      const regionMySQLQuery: MockRegionQuery = new MockRegionQuery();
      const stub2: SinonStub = sinon.stub();
      regionMySQLQuery.all = stub2;
      stub2.resolves(Dead.of<Regions, MySQLError>(new MySQLError('test failed')));
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const stub3: SinonStub = sinon.stub();
      regionRedisCommand.insertAll = stub3;
      stub3.resolves(Alive.of<DataSourceError>());
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(regionMySQLQuery, regionRedisQuery, regionRedisCommand);
      const superposition: Superposition<Regions, RegionsError | DataSourceError> = await regionQuery.all();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: RegionsError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(MySQLError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('RegionCommand returns Dead', async () => {
      const regions: MockRegions = new MockRegions();

      const regionRedisQuery: MockRegionQuery = new MockRegionQuery();
      const stub1: SinonStub = sinon.stub();
      regionRedisQuery.all = stub1;
      stub1.resolves(Dead.of<Regions, RedisError>(new RedisError('test failed')));
      const regionMySQLQuery: MockRegionQuery = new MockRegionQuery();
      const stub2: SinonStub = sinon.stub();
      regionMySQLQuery.all = stub2;
      stub2.resolves(Alive.of<Regions, NoSuchElementError>(regions));
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const stub3: SinonStub = sinon.stub();
      regionRedisCommand.insertAll = stub3;
      stub3.resolves(Dead.of<DataSourceError>(new RedisError('test faied')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(regionMySQLQuery, regionRedisQuery, regionRedisCommand);
      const superposition: Superposition<Regions, RegionsError | DataSourceError> = await regionQuery.all();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: RegionsError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(RedisError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('findByISO3166', () => {
    it('normal case', async () => {
      const regions: MockRegions = new MockRegions(
        new MockRegion({
          iso3166: new MockISO3166('AFG')
        }),
        new MockRegion({
          iso3166: new MockISO3166('ALB')
        })
      );

      const regionRedisQuery: MockRegionQuery = new MockRegionQuery();
      const stub: SinonStub = sinon.stub();
      regionRedisQuery.all = stub;
      stub.resolves(Alive.of<Regions, NoSuchElementError>(regions));
      const regionMySQLQuery: MockRegionQuery = new MockRegionQuery();
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();

      const regionQuery: RegionQuery = new RegionQuery(regionMySQLQuery, regionRedisQuery, regionRedisCommand);
      const superposition: Superposition<
        Region,
        RegionError | NoSuchElementError | DataSourceError
      > = await regionQuery.findByISO3166(ISO3166.of('ALB'));

      expect(superposition.isAlive()).toBe(true);
      expect(superposition.get()).toBe(regions.get(1).get());
    });

    it('RegionQuery.all returns Dead, MySQLError', async () => {
      const regionRedisQuery: MockRegionQuery = new MockRegionQuery();
      const stub1: SinonStub = sinon.stub();
      regionRedisQuery.all = stub1;
      stub1.resolves(Dead.of<Regions, RegionError>(new RegionError('test failed')));
      const regionMySQLQuery: MockRegionQuery = new MockRegionQuery();
      const stub2: SinonStub = sinon.stub();
      regionMySQLQuery.all = stub2;
      stub2.resolves(Dead.of<Regions, MySQLError>(new MySQLError('test failed')));
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(regionMySQLQuery, regionRedisQuery, regionRedisCommand);
      const superposition: Superposition<
        Region,
        RegionError | NoSuchElementError | DataSourceError
      > = await regionQuery.findByISO3166(ISO3166.of('ALB'));

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: RegionError | NoSuchElementError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(MySQLError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('RegionQuery.all returns Dead, RegionsError', async () => {
      const regionRedisQuery: MockRegionQuery = new MockRegionQuery();
      const stub1: SinonStub = sinon.stub();
      regionRedisQuery.all = stub1;
      stub1.resolves(Dead.of<Regions, RegionError>(new RegionError('test failed')));
      const regionMySQLQuery: MockRegionQuery = new MockRegionQuery();
      const stub2: SinonStub = sinon.stub();
      regionMySQLQuery.all = stub2;
      stub2.resolves(Dead.of<Regions, RegionsError>(new RegionsError('test failed')));
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(regionMySQLQuery, regionRedisQuery, regionRedisCommand);
      const superposition: Superposition<
        Region,
        RegionError | NoSuchElementError | DataSourceError
      > = await regionQuery.findByISO3166(ISO3166.of('ALB'));

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: RegionError | NoSuchElementError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(RegionError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('no match results', async () => {
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
      stub1.resolves(Alive.of<Regions, NoSuchElementError>(regions));
      const regionMySQLQuery: MockRegionQuery = new MockRegionQuery();
      const regionRedisCommand: MockRegionCommand = new MockRegionCommand();
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(regionMySQLQuery, regionRedisQuery, regionRedisCommand);
      const superposition: Superposition<
        Region,
        RegionError | NoSuchElementError | DataSourceError
      > = await regionQuery.findByISO3166(ISO3166.of('AIO'));

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: RegionError | NoSuchElementError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(NoSuchElementError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});
