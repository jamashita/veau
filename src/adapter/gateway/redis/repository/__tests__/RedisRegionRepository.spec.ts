import { Nullable } from '@jamashita/anden-type';
import { UUID } from '@jamashita/anden-uuid';
import { MockRedis, MockRedisString, RedisError } from '@jamashita/catacombe-redis';
import { Schrodinger } from '@jamashita/genitore-schrodinger';
import { LanguageJSON } from '../../../../../domain/Language/Language';
import { ISO3166 } from '../../../../../domain/Region/ISO3166';
import { Region, RegionJSON } from '../../../../../domain/Region/Region';
import { RegionError } from '../../../../../domain/Region/RegionError';
import { RegionID } from '../../../../../domain/Region/RegionID';
import { Regions } from '../../../../../domain/Region/Regions';
import { NoSuchElementError } from '../../../../../repository/query/error/NoSuchElementError';
import { RedisRegionRepository } from '../RedisRegionRepository';

describe('RedisRegionRepository', () => {
  describe('all', () => {
    it('normal case', async () => {
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
      const spy: jest.SpyInstance = jest.spyOn(string, 'get');

      spy.mockImplementation(() => {
        return Promise.resolve(jsonStr);
      });

      const redis: MockRedis = new MockRedis({
        string
      });

      const regionRepository: RedisRegionRepository = new RedisRegionRepository(redis);
      const schrodinger: Schrodinger<Regions, RedisError | RegionError> = await regionRepository.all();

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
      const json: Array<LanguageJSON> = [];
      const jsonStr: string = JSON.stringify(json);

      const string: MockRedisString = new MockRedisString();
      const spy: jest.SpyInstance = jest.spyOn(string, 'get');

      spy.mockImplementation(() => {
        return Promise.resolve(jsonStr);
      });

      const redis: MockRedis = new MockRedis({
        string
      });

      const regionRepository: RedisRegionRepository = new RedisRegionRepository(redis);
      const schrodinger: Schrodinger<Regions, RedisError | RegionError> = await regionRepository.all();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get().size()).toBe(json.length);
    });

    it('returns Dead when Redis returns null', async () => {
      const string: MockRedisString = new MockRedisString();
      const spy: jest.SpyInstance = jest.spyOn(string, 'get');

      spy.mockImplementation(() => {
        return Promise.resolve(null);
      });

      const redis: MockRedis = new MockRedis({
        string
      });

      const regionRepository: RedisRegionRepository = new RedisRegionRepository(redis);
      const schrodinger: Schrodinger<Regions, RedisError | RegionError> = await regionRepository.all();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });

    it('redis returns RedisError', async () => {
      const string: MockRedisString = new MockRedisString();
      const spy: jest.SpyInstance = jest.spyOn(string, 'get');

      spy.mockImplementation(() => {
        return Promise.reject(new RedisError('test failed'));
      });

      const redis: MockRedis = new MockRedis({
        string
      });

      const regionRepository: RedisRegionRepository = new RedisRegionRepository(redis);
      const schrodinger: Schrodinger<Regions, RedisError | RegionError> = await regionRepository.all();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });

    it('redis returns JSONAError', async () => {
      const string: MockRedisString = new MockRedisString();
      const spy: jest.SpyInstance = jest.spyOn(string, 'get');

      spy.mockImplementation(() => {
        return Promise.resolve('}');
      });

      const redis: MockRedis = new MockRedis({
        string
      });

      const regionRepository: RedisRegionRepository = new RedisRegionRepository(redis);
      const schrodinger: Schrodinger<Regions, RedisError | RegionError> = await regionRepository.all();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RegionError);
    });
  });

  describe('findByISO3166', () => {
    it('normal case', async () => {
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
      const spy: jest.SpyInstance = jest.spyOn(string, 'get');

      spy.mockImplementation(() => {
        return Promise.resolve(jsonStr);
      });

      const redis: MockRedis = new MockRedis({
        string
      });

      const regionRepository: RedisRegionRepository = new RedisRegionRepository(redis);
      const schrodinger: Schrodinger<Region, NoSuchElementError | RedisError | RegionError> = await regionRepository.findByISO3166(ISO3166.of('ALB'));

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
      const json: Array<RegionJSON> = [];
      const jsonStr: string = JSON.stringify(json);

      const string: MockRedisString = new MockRedisString();
      const spy: jest.SpyInstance = jest.spyOn(string, 'get');

      spy.mockImplementation(() => {
        return Promise.resolve(jsonStr);
      });

      const redis: MockRedis = new MockRedis({
        string
      });

      const regionRepository: RedisRegionRepository = new RedisRegionRepository(redis);
      const schrodinger: Schrodinger<Region, NoSuchElementError | RedisError | RegionError> = await regionRepository.findByISO3166(ISO3166.of('ALB'));

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });

    it('returns Dead because Redis returns null', async () => {
      const string: MockRedisString = new MockRedisString();
      const spy: jest.SpyInstance = jest.spyOn(string, 'get');

      spy.mockImplementation(() => {
        return Promise.resolve(null);
      });

      const redis: MockRedis = new MockRedis({
        string
      });

      const regionRepository: RedisRegionRepository = new RedisRegionRepository(redis);
      const schrodinger: Schrodinger<Region, NoSuchElementError | RedisError | RegionError> = await regionRepository.findByISO3166(ISO3166.of('ALB'));

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });

    it('no match results', async () => {
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
      const spy: jest.SpyInstance = jest.spyOn(string, 'get');

      spy.mockImplementation(() => {
        return Promise.resolve(jsonStr);
      });

      const redis: MockRedis = new MockRedis({
        string
      });

      const regionRepository: RedisRegionRepository = new RedisRegionRepository(redis);
      const schrodinger: Schrodinger<Region, NoSuchElementError | RedisError | RegionError> = await regionRepository.findByISO3166(ISO3166.of('OOP'));

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });

    it('malformat regionID', async () => {
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
      const spy: jest.SpyInstance = jest.spyOn(string, 'get');

      spy.mockImplementation(() => {
        return Promise.resolve(jsonStr);
      });

      const redis: MockRedis = new MockRedis({
        string
      });

      const regionRepository: RedisRegionRepository = new RedisRegionRepository(redis);
      const schrodinger: Schrodinger<Region, NoSuchElementError | RedisError | RegionError> = await regionRepository.findByISO3166(ISO3166.of('OOP'));

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RegionError);
    });

    it('redis returns RedisError', async () => {
      const string: MockRedisString = new MockRedisString();
      const spy: jest.SpyInstance = jest.spyOn(string, 'get');

      spy.mockImplementation(() => {
        return Promise.reject(new RedisError('test faield'));
      });

      const redis: MockRedis = new MockRedis({
        string
      });

      const regionRepository: RedisRegionRepository = new RedisRegionRepository(redis);
      const schrodinger: Schrodinger<Region, NoSuchElementError | RedisError | RegionError> = await regionRepository.findByISO3166(ISO3166.of('ALB'));

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RedisError);
    });

    it('redis returns JSONAError', async () => {
      const string: MockRedisString = new MockRedisString();
      const spy: jest.SpyInstance = jest.spyOn(string, 'get');

      spy.mockImplementation(() => {
        return Promise.resolve('}');
      });

      const redis: MockRedis = new MockRedis({
        string
      });

      const regionRepository: RedisRegionRepository = new RedisRegionRepository(redis);
      const schrodinger: Schrodinger<Region, NoSuchElementError | RedisError | RegionError> = await regionRepository.findByISO3166(ISO3166.of('ALB'));

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RegionError);
    });
  });
});
