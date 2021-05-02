import { Nullable } from '@jamashita/anden-type';
import { UUID } from '@jamashita/anden-uuid';
import { MockRedis, MockRedisString, RedisError } from '@jamashita/catacombe-redis';
import { Schrodinger } from '@jamashita/genitore';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { kernel } from '../../../Container/Kernel';
import { Type } from '../../../Container/Types';
import { LanguageJSON } from '../../../domain/VO/Language/Language';
import { RegionError } from '../../../domain/VO/Region/Error/RegionError';
import { ISO3166 } from '../../../domain/VO/Region/ISO3166';
import { Region, RegionJSON } from '../../../domain/VO/Region/Region';
import { RegionID } from '../../../domain/VO/Region/RegionID';
import { Regions } from '../../../domain/VO/Region/Regions';
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
      const schrodinger: Schrodinger<Regions, RedisError | RegionError> = await regionQuery.all().terminate();

      expect(schrodinger.isAlive()).toBe(true);

      const regions: Regions = schrodinger.get();

      expect(regions.size()).toBe(json.length);
      for (let i: number = 0; i < regions.size(); i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const regionID: RegionID = RegionID.ofString(json[i]!.regionID);
        const region: Nullable<Region> = regions.get(regionID);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(region?.getRegionID().get().get()).toBe(json[i]!.regionID);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(region?.getName().get()).toBe(json[i]!.name);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(region?.getISO3166().get()).toBe(json[i]!.iso3166);
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
      const schrodinger: Schrodinger<Regions, RedisError | RegionError> = await regionQuery.all().terminate();

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
      const schrodinger: Schrodinger<Regions, RedisError | RegionError> = await regionQuery.all().terminate();

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
      const schrodinger: Schrodinger<Regions, RedisError | RegionError> = await regionQuery.all().terminate();

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
      const schrodinger: Schrodinger<Regions, RedisError | RegionError> = await regionQuery.all().terminate();

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
      const schrodinger: Schrodinger<Region, NoSuchElementError | RedisError | RegionError> = await regionQuery.findByISO3166(ISO3166.of('ALB')).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const region: Region = schrodinger.get();

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(region.getRegionID().get().get()).toBe(json[1]!.regionID);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(region.getName().get()).toBe(json[1]!.name);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(region.getISO3166().get()).toBe(json[1]!.iso3166);
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
      const schrodinger: Schrodinger<Region, NoSuchElementError | RedisError | RegionError> = await regionQuery.findByISO3166(ISO3166.of('ALB')).terminate();

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
      const schrodinger: Schrodinger<Region, NoSuchElementError | RedisError | RegionError> = await regionQuery.findByISO3166(ISO3166.of('ALB')).terminate();

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
      const schrodinger: Schrodinger<Region, NoSuchElementError | RedisError | RegionError> = await regionQuery.findByISO3166(ISO3166.of('OOP')).terminate();

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
      const schrodinger: Schrodinger<Region, NoSuchElementError | RedisError | RegionError> = await regionQuery.findByISO3166(ISO3166.of('OOP')).terminate();

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
      const schrodinger: Schrodinger<Region, NoSuchElementError | RedisError | RegionError> = await regionQuery.findByISO3166(ISO3166.of('ALB')).terminate();

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
      const schrodinger: Schrodinger<Region, NoSuchElementError | RedisError | RegionError> = await regionQuery.findByISO3166(ISO3166.of('ALB')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });
  });
});
