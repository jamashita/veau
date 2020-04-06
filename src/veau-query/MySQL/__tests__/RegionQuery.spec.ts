import 'jest';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { kernel } from '../../../veau-container/Container';
import { TYPE } from '../../../veau-container/Types';
import { NoSuchElementError } from '../../../veau-error/NoSuchElementError';
import { MockMySQL } from '../../../veau-general/MySQL/mocks/MockMySQL';
import { MockMySQLError } from '../../../veau-general/MySQL/mocks/MockMySQLError';
import { MySQLError } from '../../../veau-general/MySQL/MySQLError';
import { Try } from '../../../veau-general/Try/Try';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { Region } from '../../../veau-vo/Region';
import { Regions } from '../../../veau-vo/Regions';
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
      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.resolves([
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
      ]);

      const regionQuery: RegionQuery = new RegionQuery(mysql);
      const trial: Try<Regions, NoSuchElementError | MySQLError> = await regionQuery.all();

      expect(trial.isSuccess()).toEqual(true);
      expect(stub.withArgs(`SELECT
      R1.region_id AS regionID,
      R1.name,
      R1.iso3166
      FROM regions R1
      FORCE INDEX(iso3166)
      ORDER BY R1.iso3166;`).called).toEqual(true);
      const regions: Regions = trial.get();
      expect(regions.size()).toEqual(2);
      expect(regions.get(0).get().getRegionID().get()).toEqual(1);
      expect(regions.get(0).get().getName().get()).toEqual('Afghanistan');
      expect(regions.get(0).get().getISO3166().get()).toEqual('AFG');
      expect(regions.get(1).get().getRegionID().get()).toEqual(2);
      expect(regions.get(1).get().getName().get()).toEqual('Albania');
      expect(regions.get(1).get().getISO3166().get()).toEqual('ALB');
    });

    it('returns Failure when MySQL.execute returns 0 results', async () => {
      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.resolves([
      ]);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(mysql);
      const trial: Try<Regions, NoSuchElementError | MySQLError> = await regionQuery.all();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | MySQLError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns Failure because the client throws MySQLError', async () => {
      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.rejects(new MockMySQLError());
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(mysql);
      const trial: Try<Regions, NoSuchElementError | MySQLError> = await regionQuery.all();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | MySQLError) => {
        spy2();
        expect(err).toBeInstanceOf(MySQLError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('throws Error', async () => {
      const error: Error = new Error();

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.rejects(error);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(mysql);

      try {
        await regionQuery.all();
        spy1();
      }
      catch (err) {
        spy2();
        expect(err).toBe(error);
      }

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('findByISO3166', () => {
    it('normal case', async () => {
      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.resolves([
        {
          regionID: 2,
          name: 'Albania',
          iso3166: 'ALB'
        }
      ]);

      const regionQuery: RegionQuery = new RegionQuery(mysql);
      const trial: Try<Region, NoSuchElementError | MySQLError> = await regionQuery.findByISO3166(ISO3166.of('ALB'));

      expect(trial.isSuccess()).toEqual(true);
      expect(stub.withArgs(`SELECT
      R1.region_id AS regionID,
      R1.name,
      R1.iso3166
      FROM regions R1
      WHERE R1.iso3166 = :iso3166;`, {
        iso3166: 'ALB'
      }).called).toEqual(true);
      const region: Region = trial.get();
      expect(region.getRegionID().get()).toEqual(2);
      expect(region.getName().get()).toEqual('Albania');
      expect(region.getISO3166().get()).toEqual('ALB');
    });

    it('returns Failure because MySQL returns 0 results', async () => {
      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.resolves([
      ]);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(mysql);
      const trial: Try<Region, NoSuchElementError | MySQLError> = await regionQuery.findByISO3166(ISO3166.of('ALB'));

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | MySQLError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns Failure because the client throws MySQLError', async () => {
      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.rejects(new MockMySQLError());
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(mysql);
      const trial: Try<Region, NoSuchElementError | MySQLError> = await regionQuery.findByISO3166(ISO3166.of('ALB'));

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | MySQLError) => {
        spy2();
        expect(err).toBeInstanceOf(MySQLError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('throws Error', async () => {
      const error: Error = new Error();

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();
      mysql.execute = stub;
      stub.rejects(error);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(mysql);

      try {
        await regionQuery.findByISO3166(ISO3166.of('ALB'));
        spy1();
      }
      catch (err) {
        spy2();
        expect(err).toBe(error);
      }

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
