import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Schrodinger } from '@jamashita/genitore-schrodinger';
import { ISO3166 } from '../../../../domain/Region/ISO3166';
import { MockRegion } from '../../../../domain/Region/mock/MockRegion';
import { Region } from '../../../../domain/Region/Region';
import { RegionError } from '../../../../domain/Region/RegionError';
import { RegionID } from '../../../../domain/Region/RegionID';
import { Regions } from '../../../../domain/Region/Regions';
import { NoSuchElementError } from '../../../../repository/query/error/NoSuchElementError';
import { MixinRegionRepository } from '../MixinRegionRepository';

describe('MixinRegionRepository', () => {
  describe('find', () => {
    it('normal case', async () => {
      const regionID: RegionID = RegionID.ofString('a1bca5f1-ecc1-4ee0-985c-d316e997c4f0');
      const region1: Region = new MockRegion({
        regionID
      });
      const region2: Region = new MockRegion({
        regionID: RegionID.ofString('780120aa-769b-432f-a97e-f4e85fd92726')
      });
      const regions: Regions = Regions.ofArray([region1, region2]);

      const regionRepository: MixinRegionRepository = new MixinRegionRepository(regions);
      const schrodinger: Schrodinger<Region, DataSourceError | NoSuchElementError | RegionError> = await regionRepository.find(regionID);

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(region1);
    });

    it('no match results', async () => {
      const regionID: RegionID = RegionID.ofString('a1bca5f1-ecc1-4ee0-985c-d316e997c4f0');
      const region1: Region = new MockRegion({
        regionID: RegionID.ofString('e7b7a90c-2db8-43c3-b623-16186418dc57')
      });
      const region2: Region = new MockRegion({
        regionID: RegionID.ofString('fb7b1d57-3641-4e07-a110-5352f5ccfe1b')
      });
      const regions: Regions = Regions.ofArray([region1, region2]);

      const regionRepository: MixinRegionRepository = new MixinRegionRepository(regions);
      const schrodinger: Schrodinger<Region, DataSourceError | NoSuchElementError | RegionError> = await regionRepository.find(regionID);

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });
  });

  describe('findByISO3166', () => {
    it('normal case', async () => {
      const region1: Region = new MockRegion({
        iso3166: ISO3166.of('AFG')
      });
      const region2: Region = new MockRegion({
        iso3166: ISO3166.of('ALB')
      });
      const regions: Regions = Regions.ofArray([region1, region2]);

      const regionRepository: MixinRegionRepository = new MixinRegionRepository(regions);
      const schrodinger: Schrodinger<Region, DataSourceError | NoSuchElementError | RegionError> = await regionRepository.findByISO3166(ISO3166.of('ALB'));

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(region2);
    });

    it('no match results', async () => {
      const region1: Region = new MockRegion({
        iso3166: ISO3166.of('AFG')
      });
      const region2: Region = new MockRegion({
        iso3166: ISO3166.of('ALB')
      });
      const regions: Regions = Regions.ofArray([region1, region2]);

      const regionRepository: MixinRegionRepository = new MixinRegionRepository(regions);
      const schrodinger: Schrodinger<Region, DataSourceError | NoSuchElementError | RegionError> = await regionRepository.findByISO3166(ISO3166.of('OOP'));

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });
  });
});
