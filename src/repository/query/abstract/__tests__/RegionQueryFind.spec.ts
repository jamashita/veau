import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Schrodinger, Superposition } from '@jamashita/genitore';
import { RegionError } from '../../../../domain/vo/Region/error/RegionError';
import { MockRegion } from '../../../../domain/vo/Region/mock/MockRegion';
import { MockRegionID } from '../../../../domain/vo/Region/mock/MockRegionID';
import { Region } from '../../../../domain/vo/Region/Region';
import { Regions } from '../../../../domain/vo/Region/Regions';
import { NoSuchElementError } from '../../error/NoSuchElementError';
import { RegionQueryFind } from '../RegionQueryFind';

describe('RegionQueryFind', () => {
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
      const all: Regions = Regions.ofSpread(region1, region2);

      const regionQuery: RegionQueryFind = RegionQueryFind.of(Superposition.alive<Regions, DataSourceError>(all));
      const schrodinger: Schrodinger<Region, DataSourceError | NoSuchElementError | RegionError> = await regionQuery.find(regionID).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(region1);
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
      const all: Regions = Regions.ofSpread(region1, region2);

      const regionQuery: RegionQueryFind = RegionQueryFind.of(Superposition.alive<Regions, DataSourceError>(all));
      const schrodinger: Schrodinger<Region, DataSourceError | NoSuchElementError | RegionError> = await regionQuery.find(regionID).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });
  });
});
