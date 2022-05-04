import { UUID } from '@jamashita/anden-uuid';
import { MockMySQL, MySQLError } from '@jamashita/catacombe-mysql';
import { Schrodinger } from '@jamashita/genitore-schrodinger';
import { ISO3166 } from '../../../../../domain/Region/ISO3166';
import { Region, RegionRow } from '../../../../../domain/Region/Region';
import { RegionError } from '../../../../../domain/Region/RegionError';
import { RegionID } from '../../../../../domain/Region/RegionID';
import { Regions } from '../../../../../domain/Region/Regions';
import { NoSuchElementError } from '../../../../../repository/query/error/NoSuchElementError';
import { MySQLRegionRepository } from '../MySQLRegionRepository';

describe('MySQLRegionRepository', () => {
  describe('all', () => {
    it('normal case', async () => {
      const rows: Array<RegionRow> = [
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

      const mysql: MockMySQL = new MockMySQL();
      const spy: jest.SpyInstance = jest.spyOn(mysql, 'execute');

      spy.mockImplementation(() => {
        return Promise.resolve(rows);
      });

      const regionRepository: MySQLRegionRepository = new MySQLRegionRepository(mysql);
      const schrodinger: Schrodinger<Regions, MySQLError | RegionError> = await regionRepository.all();

      expect(spy).toHaveBeenCalled();
      expect(schrodinger.isAlive()).toBe(true);

      const regions: Regions = schrodinger.get();

      expect(regions.size()).toBe(2);
      for (let i: number = 0; i < regions.size(); i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const regionID: RegionID = RegionID.ofString(rows[i]!.regionID);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(regions.get(regionID)?.getRegionID().get().get()).toBe(rows[i]!.regionID);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(regions.get(regionID)?.getName().get()).toBe(rows[i]!.name);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(regions.get(regionID)?.getISO3166().get()).toBe(rows[i]!.iso3166);
      }
    });

    it('returns Dead when MySQL.execute returns 0 results', async () => {
      const mysql: MockMySQL = new MockMySQL();
      const spy: jest.SpyInstance = jest.spyOn(mysql, 'execute');

      spy.mockImplementation(() => {
        return Promise.resolve([]);
      });

      const regionRepository: MySQLRegionRepository = new MySQLRegionRepository(mysql);
      const schrodinger: Schrodinger<Regions, MySQLError | RegionError> = await regionRepository.all();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      const mysql: MockMySQL = new MockMySQL();
      const spy: jest.SpyInstance = jest.spyOn(mysql, 'execute');

      spy.mockImplementation(() => {
        return Promise.reject(new MySQLError('test failed'));
      });

      const regionRepository: MySQLRegionRepository = new MySQLRegionRepository(mysql);
      const schrodinger: Schrodinger<Regions, MySQLError | RegionError> = await regionRepository.all();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });
  });

  describe('find', () => {
    it('normal case', async () => {
      const uuid: UUID = UUID.v4();
      const rows: Array<RegionRow> = [
        {
          regionID: uuid.get(),
          name: 'Albania',
          iso3166: 'ALB'
        }
      ];

      const mysql: MockMySQL = new MockMySQL();
      const spy: jest.SpyInstance = jest.spyOn(mysql, 'execute');

      spy.mockImplementation(() => {
        return Promise.resolve(rows);
      });

      const regionRepository: MySQLRegionRepository = new MySQLRegionRepository(mysql);
      const schrodinger: Schrodinger<Region, MySQLError | NoSuchElementError | RegionError> = await regionRepository.find(RegionID.of(uuid));

      expect(spy).toHaveBeenCalled();
      expect(schrodinger.isAlive()).toBe(true);
      const region: Region = schrodinger.get();

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(region.getRegionID().get().get()).toBe(rows[0]!.regionID);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(region.getName().get()).toBe(rows[0]!.name);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(region.getISO3166().get()).toBe(rows[0]!.iso3166);
    });

    it('returns Dead because MySQL returns 0 results', async () => {
      const mysql: MockMySQL = new MockMySQL();
      const spy: jest.SpyInstance = jest.spyOn(mysql, 'execute');

      spy.mockImplementation(() => {
        return Promise.resolve([]);
      });

      const regionRepository: MySQLRegionRepository = new MySQLRegionRepository(mysql);
      const schrodinger: Schrodinger<Region, MySQLError | NoSuchElementError | RegionError> = await regionRepository.find(RegionID.ofString('34242453-61ba-436c-bfda-4bbad821343e'));

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      const mysql: MockMySQL = new MockMySQL();
      const spy: jest.SpyInstance = jest.spyOn(mysql, 'execute');

      spy.mockImplementation(() => {
        return Promise.reject(new MySQLError('test failed'));
      });

      const regionRepository: MySQLRegionRepository = new MySQLRegionRepository(mysql);
      const schrodinger: Schrodinger<Region, MySQLError | NoSuchElementError | RegionError> = await regionRepository.find(RegionID.ofString('e38585c3-4d25-4f48-aabc-823949164ca1'));

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });
  });

  describe('findByISO3166', () => {
    it('normal case', async () => {
      const rows: Array<RegionRow> = [
        {
          regionID: UUID.v4().get(),
          name: 'Albania',
          iso3166: 'ALB'
        }
      ];

      const mysql: MockMySQL = new MockMySQL();
      const spy: jest.SpyInstance = jest.spyOn(mysql, 'execute');

      spy.mockImplementation(() => {
        return Promise.resolve(rows);
      });

      const regionRepository: MySQLRegionRepository = new MySQLRegionRepository(mysql);
      const schrodinger: Schrodinger<Region, MySQLError | NoSuchElementError | RegionError> = await regionRepository.findByISO3166(ISO3166.of('ALB'));

      expect(spy).toHaveBeenCalled();
      expect(schrodinger.isAlive()).toBe(true);
      const region: Region = schrodinger.get();

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(region.getRegionID().get().get()).toBe(rows[0]!.regionID);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(region.getName().get()).toBe(rows[0]!.name);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(region.getISO3166().get()).toBe(rows[0]!.iso3166);
    });

    it('returns Dead because MySQL returns 0 results', async () => {
      const mysql: MockMySQL = new MockMySQL();
      const spy: jest.SpyInstance = jest.spyOn(mysql, 'execute');

      spy.mockImplementation(() => {
        return Promise.resolve([]);
      });

      const regionRepository: MySQLRegionRepository = new MySQLRegionRepository(mysql);
      const schrodinger: Schrodinger<Region, MySQLError | NoSuchElementError | RegionError> = await regionRepository.findByISO3166(ISO3166.of('ALB'));

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      const mysql: MockMySQL = new MockMySQL();
      const spy: jest.SpyInstance = jest.spyOn(mysql, 'execute');

      spy.mockImplementation(() => {
        return Promise.reject(new MySQLError('test faied'));
      });

      const regionRepository: MySQLRegionRepository = new MySQLRegionRepository(mysql);
      const schrodinger: Schrodinger<Region, MySQLError | NoSuchElementError | RegionError> = await regionRepository.findByISO3166(ISO3166.of('ALB'));

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });
  });
});
