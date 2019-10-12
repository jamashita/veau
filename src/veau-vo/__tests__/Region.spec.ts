import 'jest';
import { ISO3166 } from '../ISO3166';
import { Region, RegionJSON, RegionRow } from '../Region';
import { RegionID } from '../RegionID';
import { RegionName } from '../RegionName';

describe('Region', () => {
  describe('equals', () => {
    it('returns true if the all properties are the same', () => {
      const region1: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
      const region2: Region = Region.of(RegionID.of(2), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
      const region3: Region = Region.of(RegionID.of(1), RegionName.of('Albania'), ISO3166.of('AFG'));
      const region4: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFB'));
      const region5: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('ALB'));

      expect(region1.equals(region1)).toEqual(true);
      expect(region1.equals(region2)).toEqual(false);
      expect(region1.equals(region3)).toEqual(false);
      expect(region1.equals(region4)).toEqual(false);
      expect(region1.equals(region5)).toEqual(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const region: Region = Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));

      expect(region.toJSON()).toEqual({
        regionID: 1,
        name: 'Afghanistan',
        iso3166: 'AFG'
      });
    });
  });

  describe('of', () => {
    it('normal case', () => {
      const regionID: RegionID = RegionID.of(3);
      const name: RegionName = RegionName.of('Albania');
      const iso3166: ISO3166 = ISO3166.of('ALB');

      const region: Region = Region.of(regionID, name, iso3166);

      expect(region.getRegionID()).toEqual(regionID);
      expect(region.getName()).toEqual(name);
      expect(region.getISO3166()).toEqual(iso3166);
    });
  });

  describe('ofJSON', () => {
    it('normal case', () => {
      const json: RegionJSON = {
        regionID: 3,
        name: 'Albania',
        iso3166: 'ALB'
      };
      const region: Region = Region.ofJSON(json);

      expect(region.getRegionID().get()).toEqual(json.regionID);
      expect(region.getName().get()).toEqual(json.name);
      expect(region.getISO3166().get()).toEqual(json.iso3166);
    });
  });

  describe('ofRow', () => {
    it('normal case', () => {
      const row: RegionRow = {
        regionID: 3,
        name: 'Albania',
        iso3166: 'ALB'
      };
      const region: Region = Region.ofRow(row);

      expect(region.getRegionID().get()).toEqual(row.regionID);
      expect(region.getName().get()).toEqual(row.name);
      expect(region.getISO3166().get()).toEqual(row.iso3166);
    });
  });
});