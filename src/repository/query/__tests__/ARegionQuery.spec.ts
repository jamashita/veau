import { DataSourceError } from '@jamashita/catacombe-datasource';
import { FetchError } from '@jamashita/catacombe-fetch';
import { Schrodinger } from '@jamashita/genitore-schrodinger';
import { Superposition } from '@jamashita/genitore-superposition';
import 'reflect-metadata';
import { RegionError } from '../../../../domain/vo/Region/error/RegionError.js';
import { ISO3166 } from '../../../../domain/vo/Region/ISO3166.js';
import { MockISO3166 } from '../../../../domain/vo/Region/mock/MockISO3166.js';
import { MockRegion } from '../../../../domain/vo/Region/mock/MockRegion.js';
import { MockRegionID } from '../../../../domain/vo/Region/mock/MockRegionID.js';
import { Region } from '../../../../domain/vo/Region/Region.js';
import { Regions } from '../../../../domain/vo/Region/Regions.js';
import { NoSuchElementError } from '../../error/NoSuchElementError.js';
import { ARegionQuery } from '../ARegionQuery.js';

class MockARegionQuery extends ARegionQuery {
  public readonly source: 'Mock' = 'Mock';

  public all(): Superposition<Regions, DataSourceError | RegionError> {
    return this.a;
  }

  private readonly a: Superposition<Regions, DataSourceError | RegionError>;

  public constructor(all: Superposition<Regions, DataSourceError | RegionError>) {
    super();
    this.a = all;
  }
}

describe('ARegionBinQuery', () => {
  describe('all', () => {
    it('normal case', async () => {
      expect.assertions(2);

      const region1: MockRegion = new MockRegion({
        regionID: new MockRegionID()
      });
      const region2: MockRegion = new MockRegion({
        regionID: new MockRegionID()
      });
      const regions: Regions = Regions.ofSpread(region1, region2);

      const regionQuery: MockARegionQuery = new MockARegionQuery(Superposition.alive<Regions, DataSourceError>(regions, DataSourceError));
      const schrodinger: Schrodinger<Regions, DataSourceError | RegionError> = await regionQuery.all().terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(regions);
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
      const regions: Regions = Regions.ofSpread(region1, region2);

      const regionQuery: MockARegionQuery = new MockARegionQuery(Superposition.alive<Regions, DataSourceError>(regions, DataSourceError));
      const schrodinger: Schrodinger<Region, DataSourceError | NoSuchElementError | RegionError> = await regionQuery.find(regionID).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(region1);
    });

    it('localeQuery.all returns Dead, FetchError', async () => {
      expect.assertions(2);

      const regionID: MockRegionID = new MockRegionID();

      const regionQuery: MockARegionQuery = new MockARegionQuery(Superposition.dead<Regions, FetchError>(new FetchError('test failed'), FetchError));
      const schrodinger: Schrodinger<Region, DataSourceError | NoSuchElementError | RegionError> = await regionQuery.find(regionID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });

    it('localeQuery.all returns Dead, RegionError', async () => {
      expect.assertions(2);

      const regionID: MockRegionID = new MockRegionID();

      const regionQuery: MockARegionQuery = new MockARegionQuery(Superposition.dead<Regions, RegionError>(new RegionError('test failed'), RegionError));
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

      const regions: Regions = Regions.ofSpread(region1, region2);

      const regionQuery: MockARegionQuery = new MockARegionQuery(Superposition.alive<Regions, DataSourceError>(regions, DataSourceError));
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

      const regions: Regions = Regions.ofSpread(region1, region2);

      const regionQuery: MockARegionQuery = new MockARegionQuery(Superposition.alive<Regions, DataSourceError>(regions, DataSourceError));
      const schrodinger: Schrodinger<Region, DataSourceError | NoSuchElementError | RegionError> = await regionQuery.findByISO3166(ISO3166.of('ALB')).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(region2);
    });

    it('localeQuery.all returns Dead, FetchError', async () => {
      expect.assertions(2);

      const regionQuery: MockARegionQuery = new MockARegionQuery(Superposition.dead<Regions, FetchError>(new FetchError('test failed'), FetchError));
      const schrodinger: Schrodinger<Region, DataSourceError | NoSuchElementError | RegionError> = await regionQuery.findByISO3166(ISO3166.of('ALB')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });

    it('localeQuery.all returns Dead, RegionError', async () => {
      expect.assertions(2);

      const regionQuery: MockARegionQuery = new MockARegionQuery(Superposition.dead<Regions, RegionError>(new RegionError('test failed'), RegionError));
      const schrodinger: Schrodinger<Region, DataSourceError | NoSuchElementError | RegionError> = await regionQuery.findByISO3166(ISO3166.of('ALB')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(RegionError);
    });

    it('no match results', async () => {
      expect.assertions(2);

      const region1: MockRegion = new MockRegion({
        iso3166: new MockISO3166('AFG')
      });
      const region2: MockRegion = new MockRegion({
        iso3166: new MockISO3166('ALB')
      });

      const regions: Regions = Regions.ofSpread(region1, region2);

      const regionQuery: MockARegionQuery = new MockARegionQuery(Superposition.alive<Regions, DataSourceError>(regions, DataSourceError));
      const schrodinger: Schrodinger<Region, DataSourceError | NoSuchElementError | RegionError> = await regionQuery.findByISO3166(ISO3166.of('OOP')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });
  });
});
