import { DataSourceError, MockError, MockMySQL, MySQLError, Superposition, UUID } from 'publikum';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { kernel } from '../../../Container/Kernel';
import { TYPE } from '../../../Container/Types';
import { NoSuchElementError } from '../../../Error/NoSuchElementError';
import { RegionError } from '../../../Error/RegionError';
import { RegionsError } from '../../../Error/RegionsError';
import { ISO3166 } from '../../../VO/ISO3166';
import { Region, RegionRow } from '../../../VO/Region';
import { Regions } from '../../../VO/Regions';
import { RegionQuery } from '../RegionQuery';

describe('RegionQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const regionQuery1: RegionQuery = kernel.get<RegionQuery>(TYPE.RegionMySQLQuery);
      const regionQuery2: RegionQuery = kernel.get<RegionQuery>(TYPE.RegionMySQLQuery);

      expect(regionQuery1).toBeInstanceOf(RegionQuery);
      expect(regionQuery1).toBe(regionQuery2);
    });
  });

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
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.resolves(rows);

      const regionQuery: RegionQuery = new RegionQuery(mysql);
      const superposition: Superposition<Regions, RegionsError | DataSourceError> = await regionQuery.all();

      expect(stub.withArgs(`SELECT
      R1.region_id AS regionID,
      R1.name,
      R1.iso3166
      FROM regions R1
      FORCE INDEX(iso3166)
      ORDER BY R1.iso3166;`).called).toBe(true);
      expect(superposition.isAlive()).toBe(true);
      const regions: Regions = superposition.get();
      expect(regions.size()).toBe(2);
      for (let i: number = 0; i < regions.size(); i++) {
        expect(regions.get(i).get().getRegionID().get().get()).toBe(rows[i].regionID);
        expect(regions.get(i).get().getName().get()).toBe(rows[i].name);
        expect(regions.get(i).get().getISO3166().get()).toBe(rows[i].iso3166);
      }
    });

    it('returns Dead when MySQL.execute returns 0 results', async () => {
      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.resolves([]);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(mysql);
      const superposition: Superposition<Regions, RegionsError | DataSourceError> = await regionQuery.all();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: RegionsError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(MySQLError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.rejects(new MySQLError('test faied'));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(mysql);
      const superposition: Superposition<Regions, RegionsError | DataSourceError> = await regionQuery.all();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: RegionsError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(MySQLError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('throws Error', async () => {
      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.rejects(new MockError());

      const regionQuery: RegionQuery = new RegionQuery(mysql);
      await expect(regionQuery.all()).rejects.toThrow(MockError);
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
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.resolves(rows);

      const regionQuery: RegionQuery = new RegionQuery(mysql);
      const superposition: Superposition<Region, RegionError | NoSuchElementError | DataSourceError> = await regionQuery.findByISO3166(ISO3166.of('ALB'));

      expect(stub.withArgs(`SELECT
      R1.region_id AS regionID,
      R1.name,
      R1.iso3166
      FROM regions R1
      WHERE R1.iso3166 = :iso3166;`, {
        iso3166: 'ALB'
      }).called).toBe(true);
      expect(superposition.isAlive()).toBe(true);
      const region: Region = superposition.get();
      expect(region.getRegionID().get().get()).toBe(rows[0].regionID);
      expect(region.getName().get()).toBe(rows[0].name);
      expect(region.getISO3166().get()).toBe(rows[0].iso3166);
    });

    it('returns Dead because MySQL returns 0 results', async () => {
      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.resolves([]);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(mysql);
      const superposition: Superposition<Region, RegionError | NoSuchElementError | DataSourceError> = await regionQuery.findByISO3166(ISO3166.of('ALB'));

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: RegionError | NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.rejects(new MySQLError('test faied'));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(mysql);
      const superposition: Superposition<Region, RegionError | NoSuchElementError | DataSourceError> = await regionQuery.findByISO3166(ISO3166.of('ALB'));

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: RegionError | NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(MySQLError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('throws Error', async () => {
      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.rejects(new MockError());

      const regionQuery: RegionQuery = new RegionQuery(mysql);
      await expect(regionQuery.findByISO3166(ISO3166.of('ALB'))).rejects.toThrow(MockError);
    });
  });
});
