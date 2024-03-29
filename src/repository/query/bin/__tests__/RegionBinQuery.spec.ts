import { DataSourceError } from '@jamashita/catacombe-datasource';
import { FetchError } from '@jamashita/catacombe-fetch';
import { Schrodinger, Superposition } from '@jamashita/genitore';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { bin } from '../../../../container/Bin';
import { Type } from '../../../../container/Types';
import { Locale } from '../../../../domain/vo/Locale/Locale';
import { MockLocale } from '../../../../domain/vo/Locale/mock/MockLocale';
import { RegionError } from '../../../../domain/vo/Region/error/RegionError';
import { ISO3166 } from '../../../../domain/vo/Region/ISO3166';
import { MockISO3166 } from '../../../../domain/vo/Region/mock/MockISO3166';
import { MockRegion } from '../../../../domain/vo/Region/mock/MockRegion';
import { MockRegionID } from '../../../../domain/vo/Region/mock/MockRegionID';
import { Region } from '../../../../domain/vo/Region/Region';
import { Regions } from '../../../../domain/vo/Region/Regions';
import { NoSuchElementError } from '../../error/NoSuchElementError';
import { MockLocaleQuery } from '../../mock/MockLocaleQuery';
import { RegionBinQuery } from '../RegionBinQuery';

describe('RegionBinQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const regionQuery1: RegionBinQuery = bin.get<RegionBinQuery>(Type.RegionBinQuery);
      const regionQuery2: RegionBinQuery = bin.get<RegionBinQuery>(Type.RegionBinQuery);

      expect(regionQuery1).toBeInstanceOf(RegionBinQuery);
      expect(regionQuery1).toBe(regionQuery2);
    });
  });

  describe('all', () => {
    it('normal case', async () => {
      expect.assertions(2);

      const locale: MockLocale = new MockLocale();

      const localeBinQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeBinQuery.all = stub;
      stub.returns(Superposition.alive<Locale, DataSourceError>(locale, DataSourceError));

      const regionQuery: RegionBinQuery = new RegionBinQuery(localeBinQuery);
      const schrodinger: Schrodinger<Regions, DataSourceError | RegionError> = await regionQuery.all().terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(locale.getRegions());
    });

    it('localeQuery returns Dead', async () => {
      expect.assertions(2);

      const localeBinQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeBinQuery.all = stub;
      stub.returns(Superposition.dead<Locale, FetchError>(new FetchError('test failed'), FetchError));

      const regionQuery: RegionBinQuery = new RegionBinQuery(localeBinQuery);
      const schrodinger: Schrodinger<Regions, DataSourceError | RegionError> = await regionQuery.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });
  });

  describe('find', () => {
    it('normal case', async () => {
      expect.assertions(2);

      const regionID: MockRegionID = new MockRegionID();
      const region1: MockRegion = new MockRegion({
        regionID
      });
      const region2: MockRegion = new MockRegion({
        regionID: new MockRegionID()
      });
      const locale: MockLocale = new MockLocale({
        regions: [region1, region2]
      });

      const localeBinQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeBinQuery.all = stub;
      stub.returns(Superposition.alive<Locale, DataSourceError>(locale, DataSourceError));

      const regionQuery: RegionBinQuery = new RegionBinQuery(localeBinQuery);
      const schrodinger: Schrodinger<Region, DataSourceError | NoSuchElementError | RegionError> = await regionQuery.find(regionID).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(region1);
    });

    it('localeQuery.all returns Dead, FetchError', async () => {
      expect.assertions(2);

      const regionID: MockRegionID = new MockRegionID();

      const localeBinQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeBinQuery.all = stub;
      stub.returns(Superposition.dead<Locale, FetchError>(new FetchError('test failed'), FetchError));

      const regionQuery: RegionBinQuery = new RegionBinQuery(localeBinQuery);
      const schrodinger: Schrodinger<Region, DataSourceError | NoSuchElementError | RegionError> = await regionQuery.find(regionID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });

    it('localeQuery.all returns Dead, RegionError', async () => {
      expect.assertions(2);

      const regionID: MockRegionID = new MockRegionID();

      const localeBinQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeBinQuery.all = stub;
      stub.returns(Superposition.dead<Locale, RegionError>(new RegionError('test failed'), RegionError));

      const regionQuery: RegionBinQuery = new RegionBinQuery(localeBinQuery);
      const schrodinger: Schrodinger<Region, DataSourceError | NoSuchElementError | RegionError> = await regionQuery.find(regionID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RegionError);
    });

    it('no match results', async () => {
      expect.assertions(2);

      const regionID: MockRegionID = new MockRegionID();
      const region1: MockRegion = new MockRegion({
        regionID: new MockRegionID()
      });
      const region2: MockRegion = new MockRegion({
        regionID: new MockRegionID()
      });
      const locale: MockLocale = new MockLocale({
        regions: [region1, region2]
      });

      const localeBinQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeBinQuery.all = stub;
      stub.returns(Superposition.alive<Locale, DataSourceError>(locale, DataSourceError));

      const regionQuery: RegionBinQuery = new RegionBinQuery(localeBinQuery);
      const schrodinger: Schrodinger<Region, DataSourceError | NoSuchElementError | RegionError> = await regionQuery.find(regionID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });
  });

  describe('findByISO3166', () => {
    it('normal case', async () => {
      expect.assertions(2);

      const region1: MockRegion = new MockRegion({
        iso3166: new MockISO3166('AFG')
      });
      const region2: MockRegion = new MockRegion({
        iso3166: new MockISO3166('ALB')
      });
      const locale: MockLocale = new MockLocale({
        regions: [region1, region2]
      });

      const localeBinQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeBinQuery.all = stub;
      stub.returns(Superposition.alive<Locale, DataSourceError>(locale, DataSourceError));

      const regionQuery: RegionBinQuery = new RegionBinQuery(localeBinQuery);
      const schrodinger: Schrodinger<Region, DataSourceError | NoSuchElementError | RegionError> = await regionQuery.findByISO3166(ISO3166.of('ALB')).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(region2);
    });

    it('localeQuery.all returns Dead, FetchError', async () => {
      expect.assertions(2);

      const localeBinQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeBinQuery.all = stub;
      stub.returns(Superposition.dead<Locale, FetchError>(new FetchError('test failed'), FetchError));

      const regionQuery: RegionBinQuery = new RegionBinQuery(localeBinQuery);
      const schrodinger: Schrodinger<Region, DataSourceError | NoSuchElementError | RegionError> = await regionQuery.findByISO3166(ISO3166.of('ALB')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });

    it('localeQuery.all returns Dead, RegionError', async () => {
      expect.assertions(2);

      const localeBinQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeBinQuery.all = stub;
      stub.returns(Superposition.dead<Locale, RegionError>(new RegionError('test failed'), RegionError));

      const regionQuery: RegionBinQuery = new RegionBinQuery(localeBinQuery);
      const schrodinger: Schrodinger<Region, DataSourceError | NoSuchElementError | RegionError> = await regionQuery.findByISO3166(ISO3166.of('ALB')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RegionError);
    });

    it('no match results', async () => {
      expect.assertions(2);

      const locale: MockLocale = new MockLocale({
        regions: [
          new MockRegion({
            iso3166: new MockISO3166('AFG')
          }),
          new MockRegion({
            iso3166: new MockISO3166('ALB')
          })
        ]
      });

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeVaultQuery.all = stub;
      stub.returns(Superposition.alive<Locale, DataSourceError>(locale, DataSourceError));

      const regionQuery: RegionBinQuery = new RegionBinQuery(localeVaultQuery);
      const schrodinger: Schrodinger<Region, DataSourceError | NoSuchElementError | RegionError> = await regionQuery.findByISO3166(ISO3166.of('OOP')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });
  });
});
