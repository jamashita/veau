import 'jest';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { kernel } from '../../../veau-container/Container';
import { TYPE } from '../../../veau-container/Types';
import { NoSuchElementError } from '../../../veau-error/NoSuchElementError';
import { MySQL } from '../../../veau-general/MySQL/MySQL';
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
      const stub: SinonStub = sinon.stub();
      MySQL.prototype.execute = stub;
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

      const regionQuery: RegionQuery = kernel.get<RegionQuery>(TYPE.RegionMySQLQuery);
      const trial: Try<Regions, NoSuchElementError> = await regionQuery.all();

      expect(trial.isSuccess()).toEqual(true);
      const regions: Regions = trial.get();

      expect(stub.withArgs(`SELECT
      R1.region_id AS regionID,
      R1.name,
      R1.iso3166
      FROM regions R1
      FORCE INDEX(iso3166)
      ORDER BY R1.iso3166;`).called).toEqual(true);
      expect(regions.size()).toEqual(2);
      expect(regions.get(0).get().getRegionID().get()).toEqual(1);
      expect(regions.get(0).get().getName().get()).toEqual('Afghanistan');
      expect(regions.get(0).get().getISO3166().get()).toEqual('AFG');
      expect(regions.get(1).get().getRegionID().get()).toEqual(2);
      expect(regions.get(1).get().getName().get()).toEqual('Albania');
      expect(regions.get(1).get().getISO3166().get()).toEqual('ALB');
    });

    it('returns Failure when MySQL returns empty array', async () => {
      const stub: SinonStub = sinon.stub();
      MySQL.prototype.execute = stub;
      stub.resolves([
      ]);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = kernel.get<RegionQuery>(TYPE.RegionMySQLQuery);
      const trial: Try<Regions, NoSuchElementError> = await regionQuery.all();

      expect(trial.isFailure()).toEqual(true);

      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('findByISO3166', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      MySQL.prototype.execute = stub;
      stub.resolves([
        {
          regionID: 2,
          name: 'Albania',
          iso3166: 'ALB'
        }
      ]);

      const regionQuery: RegionQuery = kernel.get<RegionQuery>(TYPE.RegionMySQLQuery);
      const trial: Try<Region, NoSuchElementError> = await regionQuery.findByISO3166(ISO3166.of('ALB'));

      expect(trial.isSuccess()).toEqual(true);
      const region: Region = trial.get();
      expect(region.getRegionID().get()).toEqual(2);
      expect(region.getName().get()).toEqual('Albania');
      expect(region.getISO3166().get()).toEqual('ALB');
    });

    it('MySQL returns empty array', async () => {
      const stub: SinonStub = sinon.stub();
      MySQL.prototype.execute = stub;
      stub.resolves([
      ]);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = kernel.get<RegionQuery>(TYPE.RegionMySQLQuery);
      const trial: Try<Region, NoSuchElementError> = await regionQuery.findByISO3166(ISO3166.of('ALB'));

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
