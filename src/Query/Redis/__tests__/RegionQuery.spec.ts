import {
  DataSourceError,
  MockError,
  MockRedis,
  MockRedisString,
  RedisError,
  Superposition
} from 'publikum';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { kernel } from '../../../Container/Kernel';
import { TYPE } from '../../../Container/Types';
import { NoSuchElementError } from '../../../Error/NoSuchElementError';
import { ISO3166 } from '../../../VO/ISO3166';
import { LanguageJSON } from '../../../VO/Language';
import { Region, RegionJSON } from '../../../VO/Region';
import { Regions } from '../../../VO/Regions';
import { RegionQuery } from '../RegionQuery';

describe('RegionQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const regionQuery1: RegionQuery = kernel.get<RegionQuery>(TYPE.RegionRedisQuery);
      const regionQuery2: RegionQuery = kernel.get<RegionQuery>(TYPE.RegionRedisQuery);

      expect(regionQuery1).toBeInstanceOf(RegionQuery);
      expect(regionQuery1).toBe(regionQuery2);
    });
  });

  describe('all', () => {
    it('normal case', async () => {
      const json: Array<RegionJSON> = [
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
      ];
      const jsonStr: string = JSON.stringify(json);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();
      string.get = stub;
      stub.resolves(jsonStr);
      const redis: MockRedis = new MockRedis({
        string
      });

      const regionQuery: RegionQuery = new RegionQuery(redis);
      const superposition: Superposition<Regions, NoSuchElementError | DataSourceError> = await regionQuery.all();

      expect(superposition.isAlive()).toBe(true);
      const regions: Regions = superposition.get();
      expect(regions.size()).toBe(json.length);
      for (let i: number = 0; i < regions.size(); i++) {
        expect(regions.get(i).get().getRegionID().get()).toBe(json[i].regionID);
        expect(regions.get(i).get().getName().get()).toBe(json[i].name);
        expect(regions.get(i).get().getISO3166().get()).toBe(json[i].iso3166);
      }
    });

    it('Redis returns empty array', async () => {
      const json: Array<LanguageJSON> = [];
      const jsonStr: string = JSON.stringify(json);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();
      string.get = stub;
      stub.resolves(jsonStr);
      const redis: MockRedis = new MockRedis({
        string
      });

      const regionQuery: RegionQuery = new RegionQuery(redis);
      const superposition: Superposition<Regions, NoSuchElementError | DataSourceError> = await regionQuery.all();

      expect(superposition.isAlive()).toBe(true);
      expect(superposition.get().size()).toBe(json.length);
    });

    it('returns Dead when Redis returns null', async () => {
      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();
      string.get = stub;
      stub.resolves(null);
      const redis: MockRedis = new MockRedis({
        string
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(redis);
      const superposition: Superposition<Regions, NoSuchElementError | DataSourceError> = await regionQuery.all();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('Redis returns RedisError', async () => {
      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();
      string.get = stub;
      stub.rejects(new RedisError('test faied'));
      const redis: MockRedis = new MockRedis({
        string
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(redis);
      const superposition: Superposition<Regions, NoSuchElementError | DataSourceError> = await regionQuery.all();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(RedisError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('Redis returns JSONAError', async () => {
      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();
      string.get = stub;
      stub.resolves('}');
      const redis: MockRedis = new MockRedis({
        string
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(redis);
      const superposition: Superposition<Regions, NoSuchElementError | DataSourceError> = await regionQuery.all();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(RedisError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('throws Error', async () => {
      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();
      string.get = stub;
      stub.rejects(new MockError());
      const redis: MockRedis = new MockRedis({
        string
      });

      const regionQuery: RegionQuery = new RegionQuery(redis);
      await expect(regionQuery.all()).rejects.toThrow(MockError);
    });
  });

  describe('findByISO3166', () => {
    it('normal case', async () => {
      const json: Array<RegionJSON> = [
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
      ];
      const jsonStr: string = JSON.stringify(json);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();
      string.get = stub;
      stub.resolves(jsonStr);
      const redis: MockRedis = new MockRedis({
        string
      });

      const regionQuery: RegionQuery = new RegionQuery(redis);
      const superposition: Superposition<Region, NoSuchElementError | DataSourceError> = await regionQuery.findByISO3166(
        ISO3166.of('ALB')
      );

      expect(superposition.isAlive()).toBe(true);
      const region: Region = superposition.get();
      expect(region.getRegionID().get()).toBe(json[1].regionID);
      expect(region.getName().get()).toBe(json[1].name);
      expect(region.getISO3166().get()).toBe(json[1].iso3166);
    });

    it('Redis returns empty array', async () => {
      const json: Array<RegionJSON> = [];
      const jsonStr: string = JSON.stringify(json);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();
      string.get = stub;
      stub.resolves(jsonStr);
      const redis: MockRedis = new MockRedis({
        string
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(redis);
      const superposition: Superposition<Region, NoSuchElementError | DataSourceError> = await regionQuery.findByISO3166(
        ISO3166.of('ALB')
      );

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead because Redis returns null', async () => {
      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();
      string.get = stub;
      stub.resolves(null);
      const redis: MockRedis = new MockRedis({
        string
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(redis);
      const superposition: Superposition<Region, NoSuchElementError | DataSourceError> = await regionQuery.findByISO3166(
        ISO3166.of('ALB')
      );

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('no match results', async () => {
      const json: Array<RegionJSON> = [
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
      ];
      const jsonStr: string = JSON.stringify(json);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();
      string.get = stub;
      stub.resolves(jsonStr);
      const redis: MockRedis = new MockRedis({
        string
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(redis);
      const superposition: Superposition<Region, NoSuchElementError | DataSourceError> = await regionQuery.findByISO3166(
        ISO3166.of('OOP')
      );

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('Redis returns RedisError', async () => {
      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();
      string.get = stub;
      stub.rejects(new RedisError('test faied'));
      const redis: MockRedis = new MockRedis({
        string
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(redis);
      const superposition: Superposition<Region, NoSuchElementError | DataSourceError> = await regionQuery.findByISO3166(
        ISO3166.of('ALB')
      );

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(RedisError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('Redis returns JSONAError', async () => {
      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();
      string.get = stub;
      stub.resolves('}');
      const redis: MockRedis = new MockRedis({
        string
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(redis);
      const superposition: Superposition<Region, NoSuchElementError | DataSourceError> = await regionQuery.findByISO3166(
        ISO3166.of('ALB')
      );

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(RedisError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('throws Error', async () => {
      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();
      string.get = stub;
      stub.rejects(new MockError());
      const redis: MockRedis = new MockRedis({
        string
      });

      const regionQuery: RegionQuery = new RegionQuery(redis);
      await expect(regionQuery.findByISO3166(ISO3166.of('ALB'))).rejects.toThrow(MockError);
    });
  });
});
