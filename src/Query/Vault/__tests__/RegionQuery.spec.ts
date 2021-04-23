import { FetchError } from '@jamashita/catacombe-fetch';
import { DataSourceError } from '@jamashita/anden-error';
import { Schrodinger, Superposition } from '@jamashita/genitore-superposition';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { Type } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { Locale } from '../../../VO/Locale/Locale';
import { MockLocale } from '../../../VO/Locale/Mock/MockLocale';
import { RegionError } from '../../../VO/Region/Error/RegionError';
import { ISO3166 } from '../../../VO/Region/ISO3166';
import { MockISO3166 } from '../../../VO/Region/Mock/MockISO3166';
import { MockRegion } from '../../../VO/Region/Mock/MockRegion';
import { MockRegionID } from '../../../VO/Region/Mock/MockRegionID';
import { Region } from '../../../VO/Region/Region';
import { Regions } from '../../../VO/Region/Regions';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { MockLocaleQuery } from '../../Mock/MockLocaleQuery';
import { RegionQuery } from '../RegionQuery';

describe('RegionQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const regionQuery1: RegionQuery = vault.get<RegionQuery>(Type.RegionVaultQuery);
      const regionQuery2: RegionQuery = vault.get<RegionQuery>(Type.RegionVaultQuery);

      expect(regionQuery1).toBeInstanceOf(RegionQuery);
      expect(regionQuery1).toBe(regionQuery2);
    });
  });

  describe('all', () => {
    it('normal case', async () => {
      expect.assertions(2);

      const locale: MockLocale = new MockLocale();

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeVaultQuery.all = stub;
      stub.returns(Superposition.alive<Locale, DataSourceError>(locale, DataSourceError));

      const regionQuery: RegionQuery = new RegionQuery(localeVaultQuery);
      const schrodinger: Schrodinger<Regions, DataSourceError | RegionError> = await regionQuery.all().terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(locale.getRegions());
    });

    it('localeQuery returns Dead', async () => {
      expect.assertions(2);

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeVaultQuery.all = stub;
      stub.returns(Superposition.dead<Locale, FetchError>(new FetchError('test failed', 500), FetchError));

      const regionQuery: RegionQuery = new RegionQuery(localeVaultQuery);
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

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeVaultQuery.all = stub;
      stub.returns(Superposition.alive<Locale, DataSourceError>(locale, DataSourceError));

      const regionQuery: RegionQuery = new RegionQuery(localeVaultQuery);
      const schrodinger: Schrodinger<Region, DataSourceError | NoSuchElementError | RegionError> = await regionQuery.find(regionID).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(region1);
    });

    it('localeQuery.all returns Dead, FetchError', async () => {
      expect.assertions(2);

      const regionID: MockRegionID = new MockRegionID();

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeVaultQuery.all = stub;
      stub.returns(Superposition.dead<Locale, FetchError>(new FetchError('test failed', 100), FetchError));

      const regionQuery: RegionQuery = new RegionQuery(localeVaultQuery);
      const schrodinger: Schrodinger<Region, DataSourceError | NoSuchElementError | RegionError> = await regionQuery.find(regionID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });

    it('localeQuery.all returns Dead, RegionError', async () => {
      expect.assertions(2);

      const regionID: MockRegionID = new MockRegionID();

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeVaultQuery.all = stub;
      stub.returns(Superposition.dead<Locale, RegionError>(new RegionError('test failed'), RegionError));

      const regionQuery: RegionQuery = new RegionQuery(localeVaultQuery);
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

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeVaultQuery.all = stub;
      stub.returns(Superposition.alive<Locale, DataSourceError>(locale, DataSourceError));

      const regionQuery: RegionQuery = new RegionQuery(localeVaultQuery);
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

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeVaultQuery.all = stub;
      stub.returns(Superposition.alive<Locale, DataSourceError>(locale, DataSourceError));

      const regionQuery: RegionQuery = new RegionQuery(localeVaultQuery);
      const schrodinger: Schrodinger<Region, DataSourceError | NoSuchElementError | RegionError> = await regionQuery.findByISO3166(ISO3166.of('ALB')).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(region2);
    });

    it('localeQuery.all returns Dead, FetchError', async () => {
      expect.assertions(2);

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeVaultQuery.all = stub;
      stub.returns(Superposition.dead<Locale, FetchError>(new FetchError('test failed', 100), FetchError));

      const regionQuery: RegionQuery = new RegionQuery(localeVaultQuery);
      const schrodinger: Schrodinger<Region, DataSourceError | NoSuchElementError | RegionError> = await regionQuery.findByISO3166(ISO3166.of('ALB')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });

    it('localeQuery.all returns Dead, RegionError', async () => {
      expect.assertions(2);

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeVaultQuery.all = stub;
      stub.returns(Superposition.dead<Locale, RegionError>(new RegionError('test failed'), RegionError));

      const regionQuery: RegionQuery = new RegionQuery(localeVaultQuery);
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

      const regionQuery: RegionQuery = new RegionQuery(localeVaultQuery);
      const schrodinger: Schrodinger<Region, DataSourceError | NoSuchElementError | RegionError> = await regionQuery.findByISO3166(ISO3166.of('OOP')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });
  });
});
