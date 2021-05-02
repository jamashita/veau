import { UUID } from '@jamashita/anden-uuid';
import { MockMySQL, MySQLError } from '@jamashita/catacombe-mysql';
import { Schrodinger } from '@jamashita/genitore';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { kernel } from '../../../../container/Kernel';
import { Type } from '../../../../container/Types';
import { RegionError } from '../../../../domain/vo/Region/error/RegionError';
import { ISO3166 } from '../../../../domain/vo/Region/ISO3166';
import { MockRegionID } from '../../../../domain/vo/Region/mock/MockRegionID';
import { Region, RegionRow } from '../../../../domain/vo/Region/Region';
import { RegionID } from '../../../../domain/vo/Region/RegionID';
import { Regions } from '../../../../domain/vo/Region/Regions';
import { NoSuchElementError } from '../../error/NoSuchElementError';
import { RegionQuery } from '../RegionQuery';

describe('RegionQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const regionQuery1: RegionQuery = kernel.get<RegionQuery>(Type.RegionMySQLQuery);
      const regionQuery2: RegionQuery = kernel.get<RegionQuery>(Type.RegionMySQLQuery);

      expect(regionQuery1).toBeInstanceOf(RegionQuery);
      expect(regionQuery1).toBe(regionQuery2);
    });
  });

  describe('all', () => {
    it('normal case', async () => {
      expect.assertions(9);

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
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.resolves(rows);

      const regionQuery: RegionQuery = new RegionQuery(mysql);
      const schrodinger: Schrodinger<Regions, MySQLError | RegionError> = await regionQuery.all().terminate();

      expect(stub.withArgs(`SELECT
      R1.region_id AS regionID,
      R1.name,
      R1.iso3166
      FROM regions R1
      FORCE INDEX(iso3166)
      ORDER BY R1.iso3166;`).called).toBe(true);
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
      expect.assertions(2);

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.resolves([]);

      const regionQuery: RegionQuery = new RegionQuery(mysql);
      const schrodinger: Schrodinger<Regions, MySQLError | RegionError> = await regionQuery.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      expect.assertions(2);

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.rejects(new MySQLError('test faied'));

      const regionQuery: RegionQuery = new RegionQuery(mysql);
      const schrodinger: Schrodinger<Regions, MySQLError | RegionError> = await regionQuery.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });
  });

  describe('find', () => {
    it('normal case', async () => {
      expect.assertions(5);

      const uuid: UUID = UUID.v4();
      const rows: Array<RegionRow> = [
        {
          regionID: uuid.get(),
          name: 'Albania',
          iso3166: 'ALB'
        }
      ];

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.resolves(rows);

      const regionQuery: RegionQuery = new RegionQuery(mysql);
      const schrodinger: Schrodinger<Region, MySQLError | NoSuchElementError | RegionError> = await regionQuery.find(RegionID.of(uuid)).terminate();

      expect(stub.withArgs(
        `SELECT
      R1.region_id AS regionID,
      R1.name,
      R1.iso3166
      FROM regions R1
      WHERE R1.region_id = :regionID;`,
        {
          regionID: uuid.get()
        }
      ).called).toBe(true);
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
      expect.assertions(2);

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.resolves([]);

      const regionQuery: RegionQuery = new RegionQuery(mysql);
      const schrodinger: Schrodinger<Region, MySQLError | NoSuchElementError | RegionError> = await regionQuery.find(new MockRegionID()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      expect.assertions(2);

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.rejects(new MySQLError('test faied'));

      const regionQuery: RegionQuery = new RegionQuery(mysql);
      const schrodinger: Schrodinger<Region, MySQLError | NoSuchElementError | RegionError> = await regionQuery.find(new MockRegionID()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });
  });

  describe('findByISO3166', () => {
    it('normal case', async () => {
      expect.assertions(5);

      const rows: Array<RegionRow> = [
        {
          regionID: UUID.v4().get(),
          name: 'Albania',
          iso3166: 'ALB'
        }
      ];

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.resolves(rows);

      const regionQuery: RegionQuery = new RegionQuery(mysql);
      const schrodinger: Schrodinger<Region, MySQLError | NoSuchElementError | RegionError> = await regionQuery.findByISO3166(ISO3166.of('ALB')).terminate();

      expect(stub.withArgs(
        `SELECT
      R1.region_id AS regionID,
      R1.name,
      R1.iso3166
      FROM regions R1
      WHERE R1.iso3166 = :iso3166;`,
        {
          iso3166: 'ALB'
        }
      ).called).toBe(true);
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
      expect.assertions(2);

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.resolves([]);

      const regionQuery: RegionQuery = new RegionQuery(mysql);
      const schrodinger: Schrodinger<Region, MySQLError | NoSuchElementError | RegionError> = await regionQuery.findByISO3166(ISO3166.of('ALB')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      expect.assertions(2);

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.rejects(new MySQLError('test faied'));

      const regionQuery: RegionQuery = new RegionQuery(mysql);
      const schrodinger: Schrodinger<Region, MySQLError | NoSuchElementError | RegionError> = await regionQuery.findByISO3166(ISO3166.of('ALB')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });
  });
});
