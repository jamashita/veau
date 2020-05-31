import 'reflect-metadata';

import sinon, { SinonSpy, SinonStub } from 'sinon';

import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { MockMySQL, MySQLError } from '@jamashita/publikum-mysql';
import { UUID } from '@jamashita/publikum-uuid';

import { kernel } from '../../../Container/Kernel';
import { Type } from '../../../Container/Types';
import { RegionError } from '../../../VO/Region/Error/RegionError';
import { RegionsError } from '../../../VO/Region/Error/RegionsError';
import { ISO3166 } from '../../../VO/Region/ISO3166';
import { MockRegionID } from '../../../VO/Region/Mock/MockRegionID';
import { Region, RegionRow } from '../../../VO/Region/Region';
import { RegionID } from '../../../VO/Region/RegionID';
import { Regions } from '../../../VO/Region/Regions';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { RegionQuery } from '../RegionQuery';

describe('RegionQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const regionQuery1: RegionQuery = kernel.get<RegionQuery>(Type.RegionMySQLQuery);
      const regionQuery2: RegionQuery = kernel.get<RegionQuery>(Type.RegionMySQLQuery);

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

      expect(
        stub.withArgs(`SELECT
      R1.region_id AS regionID,
      R1.name,
      R1.iso3166
      FROM regions R1
      FORCE INDEX(iso3166)
      ORDER BY R1.iso3166;`).called
      ).toBe(true);
      expect(superposition.isAlive()).toBe(true);
      const regions: Regions = superposition.get();

      expect(regions.size()).toBe(2);
      for (let i: number = 0; i < regions.size(); i++) {
        const regionID: RegionID = RegionID.ofString(rows[i].regionID).get();

        expect(regions.get(regionID).get().getRegionID().get().get()).toBe(rows[i].regionID);
        expect(regions.get(regionID).get().getName().get()).toBe(rows[i].name);
        expect(regions.get(regionID).get().getISO3166().get()).toBe(rows[i].iso3166);
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
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.resolves(rows);

      const regionQuery: RegionQuery = new RegionQuery(mysql);
      const superposition: Superposition<
        Region,
        RegionError | NoSuchElementError | DataSourceError
      > = await regionQuery.find(RegionID.of(uuid));

      expect(
        stub.withArgs(
          `SELECT
      R1.region_id AS regionID,
      R1.name,
      R1.iso3166
      FROM regions R1
      WHERE R1.region_id = :regionID;`,
          {
            regionID: uuid.get()
          }
        ).called
      ).toBe(true);
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
      const superposition: Superposition<
        Region,
        RegionError | NoSuchElementError | DataSourceError
      > = await regionQuery.find(new MockRegionID());

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

    it('returns Dead because the client throws MySQLError', async () => {
      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.rejects(new MySQLError('test faied'));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(mysql);
      const superposition: Superposition<
        Region,
        RegionError | NoSuchElementError | DataSourceError
      > = await regionQuery.find(new MockRegionID());

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
      const superposition: Superposition<
        Region,
        RegionError | NoSuchElementError | DataSourceError
      > = await regionQuery.findByISO3166(ISO3166.of('ALB'));

      expect(
        stub.withArgs(
          `SELECT
      R1.region_id AS regionID,
      R1.name,
      R1.iso3166
      FROM regions R1
      WHERE R1.iso3166 = :iso3166;`,
          {
            iso3166: 'ALB'
          }
        ).called
      ).toBe(true);
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
          expect(err).toBeInstanceOf(NoSuchElementError);
        }
      );

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
  });
});
