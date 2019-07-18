import 'jest';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { RegionID } from '../../veau-vo/RegionID';
import { RegionName } from '../../veau-vo/RegionName';
import { Region, RegionJSON, RegionRow } from '../Region';

describe('Region', () => {
  describe('equals', () => {
    it('returns true if the ids equal', () => {
      const region1: Region = Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));
      const region2: Region = Region.from(RegionID.of(2), RegionName.of('Albania'), ISO3166.of('ALB'));
      const region3: Region = Region.from(RegionID.of(1), RegionName.of('Albania'), ISO3166.of('ALB'));

      expect(region1.equals(region1)).toEqual(true);
      expect(region1.equals(region2)).toEqual(false);
      expect(region1.equals(region3)).toEqual(true);
    });
  });

  describe('copy', () => {
    it('every properties are copied', () => {
      const regionID: RegionID = RegionID.of(1);
      const name: RegionName = RegionName.of('Afghanistan');
      const iso3166: ISO3166 = ISO3166.of('AFG');

      const region: Region = Region.from(regionID, name, iso3166);
      const copied: Region = region.copy();

      expect(region).not.toBe(copied);
      expect(copied.getRegionID()).toEqual(regionID);
      expect(copied.getName()).toEqual(name);
      expect(copied.getISO3166()).toEqual(iso3166);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const region: Region = Region.from(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG'));

      expect(region.toJSON()).toEqual({
        regionID: 1,
        name: 'Afghanistan',
        iso3166: 'AFG'
      });
    });
  });

  describe('from', () => {
    it('normal case', () => {
      const regionID: RegionID = RegionID.of(3);
      const name: RegionName = RegionName.of('Albania');
      const iso3166: ISO3166 = ISO3166.of('ALB');

      const region: Region = Region.from(regionID, name, iso3166);

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
      const region: Region = Region.fromJSON(json);

      expect(region.getRegionID().get()).toEqual(json.regionID);
      expect(region.getName().get()).toEqual(json.name);
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
      const region: Region = Region.fromRow(row);

      expect(region.getRegionID().get()).toEqual(row.regionID);
      expect(region.getName().get()).toEqual(row.name);
      expect(region.getISO3166().get()).toEqual(row.iso3166);
    });
  });
});
