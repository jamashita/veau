import { Schrodinger } from '@jamashita/publikum-monad';
import { MockRedis, MockRedisString, RedisError } from '@jamashita/publikum-redis';
import { Nullable } from '@jamashita/publikum-type';
import { UUID } from '@jamashita/publikum-uuid';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { kernel } from '../../../Container/Kernel';
import { Type } from '../../../Container/Types';
import { LanguageJSON } from '../../../VO/Language/Language';
import { RegionError } from '../../../VO/Region/Error/RegionError';
import { ISO3166 } from '../../../VO/Region/ISO3166';
import { Region, RegionJSON } from '../../../VO/Region/Region';
import { RegionID } from '../../../VO/Region/RegionID';
import { Regions } from '../../../VO/Region/Regions';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { RegionQuery } from '../RegionQuery';

describe('RegionQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const regionQuery1: RegionQuery = kernel.get<RegionQuery>(Type.RegionRedisQuery);
      const regionQuery2: RegionQuery = kernel.get<RegionQuery>(Type.RegionRedisQuery);

      expect(regionQuery1).toBeInstanceOf(RegionQuery);
      expect(regionQuery1).toBe(regionQuery2);
    });
  });

  describe('all', () => {
    it('normal case', async () => {
      expect.assertions(8);

      const json: Array<RegionJSON> = [
        {
          regionID: UUID.v4().get(),
          name: 'Afghanistan',
          iso3166: 'AFG'
        },
        {
          regionID: UUID.v4().get(),
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
      const schrodinger: Schrodinger<Regions, RegionError | RedisError> = await regionQuery.all().terminate();

      expect(schrodinger.isAlive()).toBe(true);

      const regions: Regions = schrodinger.get();

      expect(regions.size()).toBe(json.length);
      for (let i: number = 0; i < regions.size(); i++) {
        const regionID: RegionID = RegionID.ofString(json[i].regionID);
        const region: Nullable<Region> = regions.get(regionID);

        expect(region?.getRegionID().get().get()).toBe(json[i].regionID);
        expect(region?.getName().get()).toBe(json[i].name);
        expect(region?.getISO3166().get()).toBe(json[i].iso3166);
      }
    });

    it('redis returns empty array', async () => {
      expect.assertions(2);

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
      const schrodinger: Schrodinger<Regions, RegionError | RedisError> = await regionQuery.all().terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get().size()).toBe(json.length);
    });

    it('returns Dead when Redis returns null', async () => {
      expect.assertions(2);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();

      string.get = stub;
      stub.resolves(null);
      const redis: MockRedis = new MockRedis({
        string
      });

      const regionQuery: RegionQuery = new RegionQuery(redis);
      const schrodinger: Schrodinger<Regions, RegionError | RedisError> = await regionQuery.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });

    it('redis returns RedisError', async () => {
      expect.assertions(2);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();

      string.get = stub;
      stub.rejects(new RedisError('test faied'));
      const redis: MockRedis = new MockRedis({
        string
      });

      const regionQuery: RegionQuery = new RegionQuery(redis);
      const schrodinger: Schrodinger<Regions, RegionError | RedisError> = await regionQuery.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });

    it('redis returns JSONAError', async () => {
      expect.assertions(2);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();

      string.get = stub;
      stub.resolves('}');
      const redis: MockRedis = new MockRedis({
        string
      });

      const regionQuery: RegionQuery = new RegionQuery(redis);
      const schrodinger: Schrodinger<Regions, RegionError | RedisError> = await regionQuery.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });
  });

  describe('findByISO3166', () => {
    it('normal case', async () => {
      expect.assertions(4);

      const json: Array<RegionJSON> = [
        {
          regionID: UUID.v4().get(),
          name: 'Afghanistan',
          iso3166: 'AFG'
        },
        {
          regionID: UUID.v4().get(),
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
      const schrodinger: Schrodinger<Region, RegionError | NoSuchElementError | RedisError> = await regionQuery.findByISO3166(ISO3166.of('ALB')).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const region: Region = schrodinger.get();

      expect(region.getRegionID().get().get()).toBe(json[1].regionID);
      expect(region.getName().get()).toBe(json[1].name);
      expect(region.getISO3166().get()).toBe(json[1].iso3166);
    });

    it('redis returns empty array', async () => {
      expect.assertions(2);

      const json: Array<RegionJSON> = [];
      const jsonStr: string = JSON.stringify(json);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();

      string.get = stub;
      stub.resolves(jsonStr);
      const redis: MockRedis = new MockRedis({
        string
      });

      const regionQuery: RegionQuery = new RegionQuery(redis);
      const schrodinger: Schrodinger<Region, RegionError | NoSuchElementError | RedisError> = await regionQuery.findByISO3166(ISO3166.of('ALB')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });

    it('returns Dead because Redis returns null', async () => {
      expect.assertions(2);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();

      string.get = stub;
      stub.resolves(null);
      const redis: MockRedis = new MockRedis({
        string
      });

      const regionQuery: RegionQuery = new RegionQuery(redis);
      const schrodinger: Schrodinger<Region, RegionError | NoSuchElementError | RedisError> = await regionQuery.findByISO3166(ISO3166.of('ALB')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });

    it('no match results', async () => {
      expect.assertions(2);

      const json: Array<RegionJSON> = [
        {
          regionID: UUID.v4().get(),
          name: 'Afghanistan',
          iso3166: 'AFG'
        },
        {
          regionID: UUID.v4().get(),
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
      const schrodinger: Schrodinger<Region, RegionError | NoSuchElementError | RedisError> = await regionQuery.findByISO3166(ISO3166.of('OOP')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });

    it('malformat regionID', async () => {
      expect.assertions(2);

      const json: Array<RegionJSON> = [
        {
          regionID: 'piu',
          name: 'Afghanistan',
          iso3166: 'AFG'
        },
        {
          regionID: 'meno',
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
      const schrodinger: Schrodinger<Region, RegionError | NoSuchElementError | RedisError> = await regionQuery.findByISO3166(ISO3166.of('OOP')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RegionError);
    });

    it('redis returns RedisError', async () => {
      expect.assertions(2);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();

      string.get = stub;
      stub.rejects(new RedisError('test faied'));
      const redis: MockRedis = new MockRedis({
        string
      });

      const regionQuery: RegionQuery = new RegionQuery(redis);
      const schrodinger: Schrodinger<Region, RegionError | NoSuchElementError | RedisError> = await regionQuery.findByISO3166(ISO3166.of('ALB')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });

    it('redis returns JSONAError', async () => {
      expect.assertions(2);

      const string: MockRedisString = new MockRedisString();
      const stub: SinonStub = sinon.stub();

      string.get = stub;
      stub.resolves('}');
      const redis: MockRedis = new MockRedis({
        string
      });

      const regionQuery: RegionQuery = new RegionQuery(redis);
      const schrodinger: Schrodinger<Region, RegionError | NoSuchElementError | RedisError> = await regionQuery.findByISO3166(ISO3166.of('ALB')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });
  });
});
