import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { kernel } from '../../../Container/Kernel';
import { TYPE } from '../../../Container/Types';
import { NoSuchElementError } from '../../../Error/NoSuchElementError';
import { DataSourceError } from '../../../General/DataSourceError';
import { MockError } from '../../../General/MockError';
import { MockRedis } from '../../../General/Redis/Mock/MockRedis';
import { MockRedisString } from '../../../General/Redis/Mock/MockRedisString';
import { Try } from '../../../General/Try/Try';
import { ISO3166 } from '../../../VO/ISO3166';
import { LanguageJSON } from '../../../VO/Language';
import { Region, RegionJSON } from '../../../VO/Region';
import { Regions } from '../../../VO/Regions';
import { RegionQuery } from '../RegionQuery';
import { RedisError } from '../../../General/Redis/RedisError';

// DONE
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
      const trial: Try<Regions, NoSuchElementError | DataSourceError> = await regionQuery.all();

      expect(trial.isSuccess()).toEqual(true);
      const regions: Regions = trial.get();
      expect(regions.size()).toEqual(json.length);
      for (let i: number = 0; i < regions.size(); i++) {
        expect(regions.get(i).get().getRegionID().get()).toEqual(json[i].regionID);
        expect(regions.get(i).get().getName().get()).toEqual(json[i].name);
        expect(regions.get(i).get().getISO3166().get()).toEqual(json[i].iso3166);
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
      const trial: Try<Regions, NoSuchElementError | DataSourceError> = await regionQuery.all();

      expect(trial.isSuccess()).toEqual(true);
      expect(trial.get().size()).toEqual(json.length);
    });

    it('returns Failure when Redis returns null', async () => {
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
      const trial: Try<Regions, NoSuchElementError | DataSourceError> = await regionQuery.all();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
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
      const trial: Try<Regions, NoSuchElementError | DataSourceError> = await regionQuery.all();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(RedisError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
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
      const trial: Try<Regions, NoSuchElementError | DataSourceError> = await regionQuery.all();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(RedisError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
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
      const trial: Try<Region, NoSuchElementError | DataSourceError> = await regionQuery.findByISO3166(
        ISO3166.of('ALB')
      );

      expect(trial.isSuccess()).toEqual(true);
      const region: Region = trial.get();
      expect(region.getRegionID().get()).toEqual(json[1].regionID);
      expect(region.getName().get()).toEqual(json[1].name);
      expect(region.getISO3166().get()).toEqual(json[1].iso3166);
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
      const trial: Try<Region, NoSuchElementError | DataSourceError> = await regionQuery.findByISO3166(
        ISO3166.of('ALB')
      );

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns Failure because Redis returns null', async () => {
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
      const trial: Try<Region, NoSuchElementError | DataSourceError> = await regionQuery.findByISO3166(
        ISO3166.of('ALB')
      );

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
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
      const trial: Try<Region, NoSuchElementError | DataSourceError> = await regionQuery.findByISO3166(
        ISO3166.of('OOP')
      );

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
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
      const trial: Try<Region, NoSuchElementError | DataSourceError> = await regionQuery.findByISO3166(
        ISO3166.of('ALB')
      );

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(RedisError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
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
      const trial: Try<Region, NoSuchElementError | DataSourceError> = await regionQuery.findByISO3166(
        ISO3166.of('ALB')
      );

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(RedisError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
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
