import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Schrodinger, Superposition } from '@jamashita/genitore';
import 'reflect-metadata';
import { RegionError } from '../../../../domain/vo/Region/error/RegionError';
import { ISO3166 } from '../../../../domain/vo/Region/ISO3166';
import { MockISO3166 } from '../../../../domain/vo/Region/mock/MockISO3166';
import { MockRegion } from '../../../../domain/vo/Region/mock/MockRegion';
import { Region } from '../../../../domain/vo/Region/Region';
import { Regions } from '../../../../domain/vo/Region/Regions';
import { NoSuchElementError } from '../../error/NoSuchElementError';
import { RegionQueryFindByISO3166 } from '../RegionQueryFindByISO3166';

describe('RegionQueryFindByISO3166', () => {
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

      const regionQuery: RegionQueryFindByISO3166 = RegionQueryFindByISO3166.of(Superposition.alive<Regions, DataSourceError>(regions));
      const schrodinger: Schrodinger<Region, DataSourceError | NoSuchElementError | RegionError> = await regionQuery.findByISO3166(ISO3166.of('ALB')).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(regions.get(region2.getRegionID()));
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

      const regionQuery: RegionQueryFindByISO3166 = RegionQueryFindByISO3166.of(Superposition.alive<Regions, DataSourceError>(regions));
      const schrodinger: Schrodinger<Region, DataSourceError | NoSuchElementError | RegionError> = await regionQuery.findByISO3166(ISO3166.of('AIO')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });
  });
});
