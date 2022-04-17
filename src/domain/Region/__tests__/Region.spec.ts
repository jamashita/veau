import { UUID } from '@jamashita/anden-uuid';
import { ISO3166 } from '../ISO3166';
import { Region, RegionJSON, RegionRow } from '../Region';
import { RegionError } from '../RegionError';
import { RegionID } from '../RegionID';
import { RegionName } from '../RegionName';

describe('Region', () => {
  describe('of', () => {
    it('normal case', () => {
      const regionID: RegionID = RegionID.ofString('581a2172-f2bb-4c8f-a82f-1ea6917de733');
      const name: RegionName = RegionName.of('afg');
      const iso3166: ISO3166 = ISO3166.of('AFG');

      const region: Region = Region.of(regionID, name, iso3166);

      expect(region.getRegionID()).toBe(regionID);
      expect(region.getName()).toBe(name);
      expect(region.getISO3166()).toBe(iso3166);
    });

    it('returns Region.empty() if RegionID is empty', () => {
      const region: Region = Region.of(RegionID.empty(), RegionName.of('afg'), ISO3166.of('AFG'));

      expect(region).toBe(Region.empty());
    });

    it('returns Region.empty() if RegionName is empty', () => {
      const region: Region = Region.of(RegionID.ofString('d2d8b19a-d65a-4fc4-98d1-612c2d2932c0'), RegionName.empty(), ISO3166.of('AFG'));

      expect(region).toBe(Region.empty());
    });

    it('returns Region.empty() if ISO3166 is empty', () => {
      const region: Region = Region.of(RegionID.ofString('02d5f6ac-3d30-4143-9586-571b20b1c7ee'), RegionName.of('afg'), ISO3166.empty());

      expect(region).toBe(Region.empty());
    });
  });

  describe('ofJSON', () => {
    it('normal case', () => {
      const json: RegionJSON = {
        regionID: UUID.v4().get(),
        name: 'Albania',
        iso3166: 'ALB'
      };

      const region: Region = Region.ofJSON(json);

      expect(region.getRegionID().get().get()).toBe(json.regionID);
      expect(region.getName().get()).toBe(json.name);
      expect(region.getISO3166().get()).toBe(json.iso3166);
    });

    it('returns Dead if regionID is malformat', () => {
      const json: RegionJSON = {
        regionID: 'puente',
        name: 'Albania',
        iso3166: 'ALB'
      };

      expect(() => {
        Region.ofJSON(json);
      }).toThrow(RegionError);
    });
  });

  describe('ofRow', () => {
    it('normal case', () => {
      const row: RegionRow = {
        regionID: UUID.v4().get(),
        name: 'Albania',
        iso3166: 'ALB'
      };

      const region: Region = Region.ofRow(row);

      expect(region.getRegionID().get().get()).toBe(row.regionID);
      expect(region.getName().get()).toBe(row.name);
      expect(region.getISO3166().get()).toBe(row.iso3166);
    });

    it('returns Dead if regionID is malformat', () => {
      const row: RegionRow = {
        regionID: 'puente',
        name: 'Albania',
        iso3166: 'ALB'
      };

      expect(() => {
        Region.ofRow(row);
      }).toThrow(RegionError);
    });
  });

  describe('validate', () => {
    it('normal case', () => {
      const n: unknown = {
        regionID: 'to to',
        name: 'Albania',
        iso3166: 'ALB'
      };

      expect(Region.validate(n)).toBe(true);
    });

    it('returns false because given parameter is not an object', () => {
      expect(Region.validate(null)).toBe(false);
      expect(Region.validate(undefined)).toBe(false);
      expect(Region.validate(56)).toBe(false);
      expect(Region.validate('fjafsd')).toBe(false);
      expect(Region.validate(false)).toBe(false);
    });

    it('returns false because regionID is missing', () => {
      const n: unknown = {
        name: 'Albania',
        iso3166: 'ALB'
      };

      expect(Region.validate(n)).toBe(false);
    });

    it('returns false because regionID is not string', () => {
      const n: unknown = {
        regionID: 2,
        name: 'Albania',
        iso3166: 'ALB'
      };

      expect(Region.validate(n)).toBe(false);
    });

    it('returns false because name is missing', () => {
      const n: unknown = {
        regionID: 'to to',
        iso3166: 'ALB'
      };

      expect(Region.validate(n)).toBe(false);
    });

    it('returns false because name is not string', () => {
      const n: unknown = {
        regionID: 'to to',
        name: true,
        iso3166: 'ALB'
      };

      expect(Region.validate(n)).toBe(false);
    });

    it('returns false because iso3166 is missing', () => {
      const n: unknown = {
        regionID: 'to to',
        name: 'Albania'
      };

      expect(Region.validate(n)).toBe(false);
    });

    it('returns false because iso3166 is not string', () => {
      const n: unknown = {
        regionID: 'to to',
        name: 'Albania',
        iso3166: -5
      };

      expect(Region.validate(n)).toBe(false);
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
    it('returns false if others given', () => {
      const region: Region = Region.empty();

      expect(region.equals(null)).toBe(false);
      expect(region.equals(undefined)).toBe(false);
      expect(region.equals('')).toBe(false);
      expect(region.equals('123')).toBe(false);
      expect(region.equals('abcd')).toBe(false);
      expect(region.equals(123)).toBe(false);
      expect(region.equals(0)).toBe(false);
      expect(region.equals(-12)).toBe(false);
      expect(region.equals(0.3)).toBe(false);
      expect(region.equals(false)).toBe(false);
      expect(region.equals(true)).toBe(false);
      expect(region.equals(Symbol('p'))).toBe(false);
      expect(region.equals(20n)).toBe(false);
      expect(region.equals({})).toBe(false);
      expect(region.equals([])).toBe(false);
      expect(region.equals(Object.create(null))).toBe(false);
    });

    it('returns true if the all properties are the same', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const region1: Region = Region.of(
        RegionID.of(uuid1),
        RegionName.of('Afghanistan'),
        ISO3166.of('AFG')
      );
      const region2: Region = Region.of(
        RegionID.of(uuid2),
        RegionName.of('Afghanistan'),
        ISO3166.of('AFG')
      );
      const region3: Region = Region.of(RegionID.of(uuid1), RegionName.of('Albania'), ISO3166.of('AFG'));
      const region4: Region = Region.of(
        RegionID.of(uuid1),
        RegionName.of('Afghanistan'),
        ISO3166.of('AFB')
      );
      const region5: Region = Region.of(
        RegionID.of(uuid1),
        RegionName.of('Afghanistan'),
        ISO3166.of('AFG')
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
      const uuid: UUID = UUID.v4();
      const region: Region = Region.of(RegionID.of(uuid), RegionName.of('Afghanistan'), ISO3166.of('AFG'));

      expect(region.toJSON()).toStrictEqual({
        regionID: uuid.get(),
        name: 'Afghanistan',
        iso3166: 'AFG'
      });
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const uuid: UUID = UUID.v4();
      const name: string = 'region 1';
      const iso3166: string = 'abc';

      const region: Region = Region.of(RegionID.of(uuid), RegionName.of(name), ISO3166.of(iso3166));

      expect(region.toString()).toBe(`${uuid.get()} ${name} ${iso3166}`);
    });
  });
});
