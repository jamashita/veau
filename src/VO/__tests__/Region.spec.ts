import { ISO3166 } from '../ISO3166';
import { MockISO3166 } from '../Mock/MockISO3166';
import { MockRegionID } from '../Mock/MockRegionID';
import { MockRegionName } from '../Mock/MockRegionName';
import { Region, RegionJSON, RegionRow } from '../Region';
import { RegionID } from '../RegionID';
import { RegionName } from '../RegionName';

describe('Region', () => {
  describe('of', () => {
    it('normal case', () => {
      const regionID: RegionID = RegionID.of(3);
      const name: RegionName = RegionName.of('Albania');
      const iso3166: ISO3166 = ISO3166.of('ALB');

      const region: Region = Region.of(
        regionID,
        name,
        iso3166
      );

      expect(region.getRegionID()).toBe(regionID);
      expect(region.getName()).toBe(name);
      expect(region.getISO3166()).toBe(iso3166);
    });

    it('all are empty, returns Region.empty()', () => {
      const region: Region = Region.of(
        RegionID.empty(),
        RegionName.empty(),
        ISO3166.empty()
      );

      expect(region).toBe(Region.empty());
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

      expect(region.getRegionID().get()).toBe(json.regionID);
      expect(region.getName().get()).toBe(json.name);
      expect(region.getISO3166().get()).toBe(json.iso3166);
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

      expect(region.getRegionID().get()).toBe(row.regionID);
      expect(region.getName().get()).toBe(row.name);
      expect(region.getISO3166().get()).toBe(row.iso3166);
    });
  });

  describe('isJSON', () => {
    it('normal case', () => {
      const n: unknown = {
        regionID: 3,
        name: 'Albania',
        iso3166: 'ALB'
      };

      expect(Region.isJSON(n)).toBe(true);
    });

    it('returns false because given parameter is not an object', () => {
      expect(Region.isJSON(null)).toBe(false);
      expect(Region.isJSON(undefined)).toBe(false);
      expect(Region.isJSON(56)).toBe(false);
      expect(Region.isJSON('fjafsd')).toBe(false);
      expect(Region.isJSON(false)).toBe(false);
    });

    it('returns false because regionID is missing', () => {
      const n: unknown = {
        name: 'Albania',
        iso3166: 'ALB'
      };

      expect(Region.isJSON(n)).toBe(false);
    });

    it('returns false because regionID is not number', () => {
      const n: unknown = {
        regionID: 'to to',
        name: 'Albania',
        iso3166: 'ALB'
      };

      expect(Region.isJSON(n)).toBe(false);
    });

    it('returns false because name is missing', () => {
      const n: unknown = {
        regionID: 3,
        iso3166: 'ALB'
      };

      expect(Region.isJSON(n)).toBe(false);
    });

    it('returns false because name is not string', () => {
      const n: unknown = {
        regionID: 3,
        name: true,
        iso3166: 'ALB'
      };

      expect(Region.isJSON(n)).toBe(false);
    });

    it('returns false because iso3166 is missing', () => {
      const n: unknown = {
        regionID: 3,
        name: 'Albania'
      };

      expect(Region.isJSON(n)).toBe(false);
    });

    it('returns false because iso3166 is not string', () => {
      const n: unknown = {
        regionID: 3,
        name: 'Albania',
        iso3166: -5
      };

      expect(Region.isJSON(n)).toBe(false);
    });
  });

  describe('empty', () => {
    it('returns each default value', () => {
      const region: Region = Region.empty();

      expect(region.getRegionID()).toBe(RegionID.empty());
      expect(region.getName()).toBe(RegionName.empty());
      expect(region.getISO3166()).toBe(ISO3166.empty());
    });

    it('returns singleton instance', () => {
      expect(Region.empty()).toBe(Region.empty());
    });
  });

  describe('equals', () => {
    it('returns true if the all properties are the same', () => {
      const region1: Region = Region.of(
        new MockRegionID(1),
        new MockRegionName('Afghanistan'),
        new MockISO3166('AFG')
      );
      const region2: Region = Region.of(
        new MockRegionID(2),
        new MockRegionName('Afghanistan'),
        new MockISO3166('AFG')
      );
      const region3: Region = Region.of(
        new MockRegionID(1),
        new MockRegionName('Albania'),
        new MockISO3166('AFG')
      );
      const region4: Region = Region.of(
        new MockRegionID(1),
        new MockRegionName('Afghanistan'),
        new MockISO3166('AFB')
      );
      const region5: Region = Region.of(
        new MockRegionID(1),
        new MockRegionName('Afghanistan'),
        new MockISO3166('AFG')
      );

      expect(region1.equals(region1)).toBe(true);
      expect(region1.equals(region2)).toBe(false);
      expect(region1.equals(region3)).toBe(false);
      expect(region1.equals(region4)).toBe(false);
      expect(region1.equals(region5)).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const region: Region = Region.of(
        RegionID.of(1),
        RegionName.of('Afghanistan'),
        ISO3166.of('AFG')
      );

      expect(region.toJSON()).toEqual({
        regionID: 1,
        name: 'Afghanistan',
        iso3166: 'AFG'
      });
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const id: number = 3;
      const name: string = 'region 1';
      const iso3166: string = 'abc';

      const region: Region = Region.of(
        RegionID.of(id),
        RegionName.of(name),
        ISO3166.of(iso3166)
      );

      expect(region.toString()).toBe(`${id} ${name} ${iso3166}`);
    });
  });
});
