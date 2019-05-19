/* tslint:disable */
import 'jest';
import { Region, RegionJSON, RegionRow } from '../../veau-entity/Region';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { RegionID } from '../../veau-vo/RegionID';
import { RegionFactory } from '../RegionFactory';

describe('RegionFactory', () => {
  describe('from', () => {
    it('normal case', () => {
      const regionID: RegionID = RegionID.of(3);
      const name: string = 'Albania';
      const iso3166: ISO3166 = ISO3166.of('ALB');

      const regionFactory: RegionFactory = RegionFactory.getInstance();
      const region: Region = regionFactory.from(regionID, name, iso3166);

      expect(region.getRegionID()).toEqual(regionID);
      expect(region.getName()).toEqual(name);
      expect(region.getISO3166()).toEqual(iso3166);
    });
  });

  describe('fromJSON', () => {
    it('normal case', () => {
      const json: RegionJSON = {
        regionID: 3,
        name: 'Albania',
        iso3166: 'ALB'
      };
      const regionFactory: RegionFactory = RegionFactory.getInstance();
      const region: Region = regionFactory.fromJSON(json);

      expect(region.getRegionID().get()).toEqual(json.regionID);
      expect(region.getName()).toEqual(json.name);
      expect(region.getISO3166().get()).toEqual(json.iso3166);
    });
  });

  describe('fromRow', () => {
    it('normal case', () => {
      const row: RegionRow = {
        regionID: 3,
        name: 'Albania',
        iso3166: 'ALB'
      };
      const regionFactory: RegionFactory = RegionFactory.getInstance();
      const region: Region = regionFactory.fromRow(row);

      expect(region.getRegionID().get()).toEqual(row.regionID);
      expect(region.getName()).toEqual(row.name);
      expect(region.getISO3166().get()).toEqual(row.iso3166);
    });
  });
});
